const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: String,
        email: {
            type: String,
            unique: true,
            required: true,
        },
        password: String,
        profilePic: String,
        role: String,
        resetPasswordToken: String, // New field for password reset token
        resetPasswordExpires: Date, // New field for token expiration
    },
    {
        timestamps: true, // Automatically adds `createdAt` and `updatedAt`
    }
);

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
