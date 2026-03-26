<p align="center">
  <img src="./Zyphronix-Brand.png" width="400" alt="Zyphronix Logo" />
</p>
<h1 align="center" style="margin-top: -25px;">Zyphronix E-Commerce Backend API</h1>

Welcome to the backend repository of **Zyphronix**, a modern and scalable E-Commerce platform built with Node.js. This project strictly follows the **MVC (Model-View-Controller)** architecture for clean code separation and scalability.

## 🚀 Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (with Mongoose ODM)
* **Authentication:** JSON Web Tokens (JWT)
* **File Uploads:** Multer
* **Cloud Storage:** Cloudinary
* **Security & Encryption:** bcryptjs (for password hashing)

## ✨ Features Implemented So Far

### 1. Admin Authentication (Guard) 🛡️
* Secure Admin Registration with hashed passwords.
* Admin Login generation JWT Bearer Tokens.
* Protected routes ensuring only authorized admins can make changes.

### 2. Category Management 📂
* **Add Category (POST):** Admins can create new categories (e.g., Laptops, Mobiles).
* **Cloudinary Integration:** Category images are dynamically uploaded and securely hosted on Cloudinary via custom Multer storage middleware.
* **Fetch Categories (GET):** Retrieve all active categories along with their Cloudinary secure URLs.

*(Note: Products, Sub-categories, and User flows are currently under development as part of the next phase.)*

## 📁 Project Structure (MVC)

Zyphronix-Backend/
│
├── src/
│   ├── config/          # Database connection
│   ├── controllers/     # Request handlers (Logic managers)
│   ├── middlewares/     # Auth Guards and Multer/Cloudinary storage
│   ├── models/          # Mongoose Schemas (Database structure)
│   ├── routes/          # API Endpoints (Doors)
│   ├── services/        # Database operations (Workers)
│   └── utils/           # Helper functions (Responses, Messages, Mailer)
│
├── .env                 # Environment variables (Hidden)
├── index.js             # Main routing hub
└── server.js            # Server entry point


## 🛠️ How to Run Locally

1. Clone the repository:
git clone https://github.com/HardikSoni1994/Zyphronix-E-Commerce-Backend.git

2. Install dependencies:
npm install

3. Set up Environment Variables (.env):
Create a .env file in the root directory and add the following:

PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

4. Start the server:
npm run dev

---
Developed with ❤️ by Hardik Soni