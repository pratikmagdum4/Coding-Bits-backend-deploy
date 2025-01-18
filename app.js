const express = require('express');
const dotenv=require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser=require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const protectedRoutes=require('./routes/protected');
const cors=require('cors');

const User = require('./models/userModel'); // Import User model
const PasswordReset = require('./models/passwordResetSchema'); // Import PasswordReset model
const { sendResetEmail } = require('./services/emailService');  // Import the email service

// configDotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());


const forgotPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per 15 minutes
    message: 'Too many requests, please try again later.'
});

const resetPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 reset password requests per 15 minutes
    message: 'Too many reset attempts, please try again later.'
});



// Route to request password reset
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    // Validate email input
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if the email exists in the database
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: 'Email not found' });
    }

    // Generate a reset token
    const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '1h' });

    // Store the token in the database
    const resetToken = new PasswordReset({
        email,
        token,
        expiration: new Date(Date.now() + 60 * 60 * 1000) // 1 hour expiration
    });

    await resetToken.save();

    // Send the reset email
    sendResetEmail(email, token);  // Call the function from the email service

    res.status(200).json({ message: 'Password reset email sent' });
});

// Route to reset the password
app.post('/reset-password', resetPasswordLimiter, async (req, res) => {
    const { token, newPassword } = req.body;

    // Validate new password format (min 8 chars, at least one number, and one special character)
    if (!newPassword || newPassword.length < 8 || !/\d/.test(newPassword) || !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
        return res.status(400).json({ message: 'Password must be at least 8 characters, and include at least one number and one special character.' });
    }

    try {
        // Validate the token
        const decoded = jwt.verify(token,process.env.SECRET_KEY );
        const email = decoded.email;

        // Check if token exists in the database and is valid (not expired)
        const resetToken = await PasswordReset.findOne({ token });
        if (!resetToken || resetToken.expiration < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Find the user and update their password
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        // Delete the used reset token
        await PasswordReset.deleteOne({ token });

        res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
        console.error('Error during password reset:', error);
        return res.status(400).json({ message: 'Invalid token' });
    }
});


// Middleware
app.use(express.json());

// Connect to Database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);



// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


