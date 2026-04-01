import exp from 'express';
import bcrypt from 'bcryptjs';
import { authenticate } from '../services/authService.js';
import { UserTypeModel } from '../Models/UserModel.js';
import { verifyToken } from '../middlewares/VerifyToken.js';
export const commonRoute = exp.Router();
// Login
commonRoute.post("/login", async (req, res) => {
    try {
        //Get credentials from body
        const userCred = req.body;

        // Call authenticate service
        const { token, user } = await authenticate(userCred);

        // Save token in httpOnly cookie
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false, // true in production (HTTPS)
        });

        // Send response
        res.status(200).json({
            message: "Login successful",
            payload: user,
            token: token // for testing
        });

    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
});
 

//logout
commonRoute.get("/logout",async(req,res)=>{
        // Clear the cookie named 'token'
        res.clearCookie('token', {
          httpOnly: true, // Must match original  settings
          secure: false,   // Must match original  settings
          sameSite: 'lax' // Must match original  settings
        });
        res.status(200).json({ message: 'Logged out successfully' });
    })
// Change password (protected route)
commonRoute.put("/change-password", verifyToken, async (req, res) => {
    try {
        //  Extract passwords from body
        const { currentPassword, newPassword } = req.body;

        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Both passwords are required" });
        }

        //  Get logged-in user using ID from token
        const userDoc = await UserTypeModel.findById(req.userId);

        if (!userDoc) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare current password
        const isMatch = await bcrypt.compare(currentPassword, userDoc.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }

        // Prevent using same password again
        const isSamePassword = await bcrypt.compare(newPassword, userDoc.password);

        if (isSamePassword) {
            return res.status(400).json({ message: "New password cannot be same as old password" });
        }

        //  Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update pass
        userDoc.password = hashedPassword;

        // Save updated doc
        await userDoc.save();

        // Success res
        res.status(200).json({ message: "Password changed successfully" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
//page refresh
commonRoute.get("/check-auth", verifyToken("USER","AUTHOR","ADMIN"), (req, res) => {
    res.status(200).json({ message: "authenticated", payload: req.user });
});
