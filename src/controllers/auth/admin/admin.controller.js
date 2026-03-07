const AdminAuthServices = require("../../../services/auth/admin/admin.service");
const { MSG } = require("../../../utils/msg");
const { errorResponse, successResponse } = require("../../../utils/response");
const sendotpmailer = require("../../../utils/mailer");
const statusCode = require('http-status-codes');
const moment = require("moment");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');


const adminAuthService = new AdminAuthServices();

module.exports.registerAdmin = async (req, res) => {
  try {
    console.log(req.body);
    console.log("=== Register Admin successfully ===");

    req.body.password = await bcrypt.hash(String(req.body.password), 10);

    req.body.create_at = moment().format("DD/MM/YYYY, hh:mm:ss a");
    req.body.update_at = moment().format("DD/MM/YYYY, hh:mm:ss a");

    const newAdmin = await adminAuthService.registerAdmin(req.body);

    if (!newAdmin) {
      return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.ADMIN_REGISTRATION_FAILED));
    }
    return res.status(statusCode.CREATED).json(successResponse(statusCode.CREATED, false, MSG.ADMIN_REGISTRATION_SUCCESS, newAdmin),
      );
  } catch (error) {
    console.log("Error :", error);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(errorResponse(statusCode.INTERNAL_SERVER_ERROR, true, MSG.INTERNAL_SERVER_ERROR));
  }
};

module.exports.loginAdmin = async (req, res) => {
  try {
    const admin = await adminAuthService.singleAdmin({email: req.body.email});
    
    if (!admin) {
      return res.status(statusCode.NOT_FOUND).json(errorResponse(statusCode.NOT_FOUND, true, MSG.ADMIN_NOT_FOUND));
    }
    console.log("Database mein current attempt count:", admin.attempt);

    const isPasswordValid = await bcrypt.compare(req.body.password, admin.password);
    
    if (!isPasswordValid) {
      return res.status(statusCode.UNAUTHORIZED).json(errorResponse(statusCode.UNAUTHORIZED, true, MSG.ADMIN_LOGIN_FAILED));
    }

    // JWT Token Generate Logic
    const payload = {
      adminId: admin._id,
      email: admin.email,
      role: "admin"
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7D"} );

    return res.status(statusCode.OK).json(successResponse(statusCode.OK, false, MSG.ADMIN_LOGIN_SUCCESS, admin, {token}));
    
  } catch (error) {
    console.log("Error :", error);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(errorResponse(statusCode.INTERNAL_SERVER_ERROR, true, MSG.INTERNAL_SERVER_ERROR));
  }
};

module.exports.fetchAllAdmin = async (req, res) => {
  try {
    const admins = await adminAuthService.fetchAllAdmin();
    
    if(!admins || admins.length === 0){
        return res.status(statusCode.NOT_FOUND).json(errorResponse(statusCode.NOT_FOUND, true, "No admins found"));
    }

    return res.status(statusCode.OK).json(successResponse(statusCode.OK, false, "All Admins Fetched Successfully", admins));
  } catch (error) {
    console.log("Error :", error);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(errorResponse(statusCode.INTERNAL_SERVER_ERROR, true, MSG.INTERNAL_SERVER_ERROR));
  }
};

// 🔑 ADMIN FORGOT PASSWORD & OTP LOGIC
module.exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const admin = await adminAuthService.singleAdmin({ email: email });
    
    if (!admin) {
      return res.status(statusCode.NOT_FOUND).json(errorResponse(statusCode.NOT_FOUND, true, "Admin not found with this email"));
    }

    let currentAttempt = admin.attempt || 0; 
    let currentExpire = admin.attempt_expire || null;

    // Check if already 3 attempts ho chuke hain
    if (currentAttempt >= 3 && currentExpire && new Date(currentExpire) > new Date()) {
        return res.status(statusCode.TOO_MANY_REQUESTS).json(
            errorResponse(statusCode.TOO_MANY_REQUESTS, true, "You are excced the limit of send OTPs.")
        );
    }
    
    // Agar 60 min expire ho gaya hai to reset karo
    if (currentAttempt >= 3 && currentExpire && new Date(currentExpire) <= new Date()) {
        currentAttempt = 0;
        currentExpire = null;
        await adminAuthService.updateAdmin(admin._id, { 
            attempt: 0, 
            attempt_expire: null 
        });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const expireOTPTime = new Date(Date.now() + 1000 * 60 * 2); // 2 minute ki expiry

    console.log("Generated Admin OTP:", otp);

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Zyphronix E-Commerce - Admin Password Reset OTP",
        html: `
            <h3>Hello ${admin.first_name},</h3>
            <p>Your Admin OTP for password reset is: <b style="font-size: 20px; color: blue;">${otp}</b></p>
            <p>Please do not share this OTP with anyone.</p>
        `
    };

    sendotpmailer.sendMail(mailOptions, async (error, info) => {
        if (error) {
            console.log("Email Bhejne Mein Error:", error);
            return res.status(statusCode.INTERNAL_SERVER_ERROR).json(errorResponse(statusCode.INTERNAL_SERVER_ERROR, true, "Failed to send OTP email"));
        }
        
        // Email successfully send hone ke BAAD hi attempt count badhao
        currentAttempt++;
        
        if (currentAttempt === 3) {
            currentExpire = new Date(Date.now() + 1000 * 60 * 60); // 60 minute lock
        }

        // Database update
        await adminAuthService.updateAdmin(admin._id, { 
            OTP: otp, 
            OTPExpire: expireOTPTime, 
            attempt: currentAttempt, 
            attempt_expire: currentExpire 
        });
        
        console.log("Updated attempt count:", currentAttempt);
        console.log("Expire time:", currentExpire);
        
        return res.status(statusCode.OK).json(
            successResponse(statusCode.OK, false, "OTP sent successfully to Admin email", { email, otp }) 
        );
    });

  } catch (error) {
    console.log("Admin Forgot Password Error:", error);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(errorResponse(statusCode.INTERNAL_SERVER_ERROR, true, MSG.INTERNAL_SERVER_ERROR));
  }
};

// 🛡️ VERIFY OTP & WRONG ATTEMPT LOGIC
module.exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const admin = await adminAuthService.singleAdmin({ email: email });
    if (!admin) {
      return res.status(statusCode.NOT_FOUND).json(errorResponse(statusCode.NOT_FOUND, true, "Admin not found with this email"));
    }

    // --- 1. VERIFY ATTEMPT BLOCK CHECK ---
    let currentVerifyAttempt = admin.verify_attempt || 0;
    let currentVerifyExpire = admin.verify_attempt_expire || null;

    if (currentVerifyAttempt >= 3) {
        if (currentVerifyExpire && new Date(currentVerifyExpire) > new Date()) {
            return res.status(statusCode.TOO_MANY_REQUESTS).json(
                errorResponse(statusCode.TOO_MANY_REQUESTS, true, "You've Entered 3 times wrong OTPs please Try again after sometimes.")
            );
        } else {
            // Lock time poora ho gaya, sab reset kar do
            currentVerifyAttempt = 0;
            currentVerifyExpire = null;
        }
    }

    // --- 2. CHECK IF OTP IS EXPIRED ---
    if (admin.OTPExpire && new Date(admin.OTPExpire) < new Date()) {
        return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, "OTP expire ho chuka hai. Naya OTP mangwayein."));
    }

    // --- 3. CHECK IF OTP IS WRONG ---
    // Note: 'otp' Postman se String mein aayega, aur DB mein Number hai, isliye Number() lagaya
    if (admin.OTP !== Number(otp)) {
        currentVerifyAttempt++; // Galat OTP par attempt badha do
        
        if (currentVerifyAttempt >= 3) {
            // 3 baar galat dala toh 60 minute ka lock
            currentVerifyExpire = new Date(Date.now() + 1000 * 60 * 60); 
        }

        await adminAuthService.updateAdmin(admin._id, { 
            verify_attempt: currentVerifyAttempt, 
            verify_attempt_expire: currentVerifyExpire 
        });

        return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, `Galat OTP! Remaining attempts: ${3 - currentVerifyAttempt}`));
    }

    // --- 4. OTP IS CORRECT (SUCCESS) 🎉 ---
    // Agar sab sahi hai, toh saare attempts aur OTP database se clear kar do
    await adminAuthService.updateAdmin(admin._id, { 
        OTP: 0, 
        OTPExpire: null, 
        attempt: 0, 
        attempt_Expire: null,
        verify_attempt: 0,
        verify_attempt_expire: null
    });

    return res.status(statusCode.OK).json(
        successResponse(statusCode.OK, false, "OTP Verified Successfully!", { email }) 
    );

  } catch (error) {
    console.log("Admin Verify OTP Error:", error);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(errorResponse(statusCode.INTERNAL_SERVER_ERROR, true, "Internal Server Error"));
  }
};

// 🔐 RESET PASSWORD LOGIC (Set New Password)

module.exports.resetPassword = async (req, res) => {
  try {
    const { email, new_password, confirm_password } = req.body;

    // 1. Check karo dono password match ho rahe hain ya nahi
    if (new_password !== confirm_password) {
        return res.status(statusCode.BAD_REQUEST).json(
            errorResponse(statusCode.BAD_REQUEST, true, "New password aur confirm password match nahi ho rahe!")
        );
    }

    // 2. Admin ko database mein dhoondho
    const admin = await adminAuthService.singleAdmin({ email: email });
    if (!admin) {
      return res.status(statusCode.NOT_FOUND).json(
          errorResponse(statusCode.NOT_FOUND, true, "Admin not found with this email")
      );
    }

    // 3. Naye password ko hash (encrypt) karo
    const bcrypt = require("bcryptjs"); // Agar upar import nahi hai toh yahan kar liya
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(new_password, salt);

    // 4. Database mein naya password update kar do
    await adminAuthService.updateAdmin(admin._id, { 
        password: hashedPassword 
    });

    // 5. Success message bhej do
    return res.status(statusCode.OK).json(
        successResponse(statusCode.OK, false, "Password reset successfully! Ab aap login kar sakte hain.", { email }) 
    );

  } catch (error) {
    console.log("Admin Reset Password Error:", error);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(
        errorResponse(statusCode.INTERNAL_SERVER_ERROR, true, "Internal Server Error")
    );
  }
};

