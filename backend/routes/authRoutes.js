const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const sendMail = require('../helpers/emailService');
const authToken = require('../middleware/authToken');
const userRegisterController = require('../controller/userRegister')
const userLoginController = require('../controller/userLogin')
const router = express.Router();

// Utility function to generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
};

// Registration endpoint
router.post('/register', userRegisterController);
router.post('/login', userLoginController)


// Send OTP endpoint for password reset
router.post('/send-otp', async (req, res) => {
    const { email } = req.body;
    const otp = generateOTP();

    try {
        await User.updateOne({ email }, { otp, otpExpires: Date.now() + 3600000 }); // 1 hour expiration
        
        const emailSubject = 'Recuperare Parola';
        const emailBody = `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #fafafa;">
                <h2 style="color: #4CAF50; text-align: center;">Recuperare Parola</h2>
                <p style="font-size: 12px; color: #000000;">Salut, </p>
                <p style="font-size: 12px; color: #000000;">Ai solicitat să îți recuperezi parola pentru contul tău. Te rugăm să folosești codul de mai jos pentru a continua procesul de resetare a parolei:</p>
                <div style="font-size: 1.5em; font-weight: bold; margin: 20px 0; padding: 10px; color: #4CAF50; text-align: center; border: 1px solid #4CAF50; border-radius: 5px; background-color: #e8f5e9;">${otp}</div>
                <p style="font-size: 12px; color: #000000;">Introdu acest cod în aplicație pentru a-ți reseta parola.</p>
                <p style="font-size: 12px; color: #000000;">Dacă nu ai solicitat resetarea parolei, te rugăm să ignori acest email. Codul va expira într-o oră.</p>
                <p style="font-size: 12px; color: #000000;">Mulțumim,</p>
                <p style="font-weight: bold; font-size: 12px; color: #000000;">Echipa Bookish Boutique</p>
            </div>
        `;

        await sendMail(email, emailSubject, emailBody);
            
        res.status(200).json({ 
            success: true,
            error: false,
            message: 'OTP sent successfully' });
        console.log("otp", otp)
    } catch (error) {
        res.status(500).json({ 
            message: 'Error sending OTP', 
            error: true,
            success: false
         });
    }
});

// Verify OTP endpoint
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({ 
                message: 'Invalid or expired OTP',
             });
        }

        res.status(200).json({ 
            message: 'OTP verified successfully',
            success: true,
            error: false
         });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying OTP', error:true, success: false });
    }
});

// Reset password endpoint
router.post('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const salt = bcrypt.genSaltSync(10);
        user.password = await bcrypt.hashSync(newPassword, salt);
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully', success: true, error: false });
    } catch (error) {
        res.status(500).json({ message: 'Error resetting password', error: true, success: false });
    }
});


// Verify email endpoint
router.get('/verify-email', async (req, res) => {
    const { token } = req.query;
    console.log("Token received:", token);

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);

        console.log("Decoded Token:", decoded);
        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(400).json({ message: 'Invalid token or user not found' });
        }
        console.log("User found for verification:", user);

        user.emailVerified = true;
        await user.save();
        console.log("User emailVerified status updated:", user.emailVerified);

        res.status(200).json({ message: 'Email verified successfully', error: false, success: true });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying email', error: true, success: false });
    }
});

// Protected route example
router.get('/profile', authToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            data: user,
            success: true,
            error: false
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user profile', error });
    }
});

module.exports = router;
