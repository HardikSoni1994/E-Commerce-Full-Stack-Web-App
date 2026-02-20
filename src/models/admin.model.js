const mongoose = require('mongoose');

const adminSchema = mongoose.Schema (
    {
        first_name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
        isDelete: {
            type: Boolean,
            default: false
        },
        create_at: {
            type: String,
            required: true
        },
        update_at: {
            type: String,
            required: true
        }
    }
);

module.exports = mongoose.model("Admin", adminSchema, "Admin");