import { Router } from "express";
import { addToHistory, getUserHistory, login, register, updateLeaveTime } from "../controllers/user.controller.js";
import passport from "passport";
import crypto from "crypto"; // <--- Make sure this is imported

const router = Router();

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/add_to_activity").post(addToHistory);
router.route("/update_leave_time").post(updateLeaveTime);
router.route("/get_all_activity").get(getUserHistory);

router.route("/auth/google").get(
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.route("/auth/google/callback").get(
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    
    try {
        const user = req.user;

        // --- FIX STARTS HERE ---
        
        // 1. Generate a random token (Just like your Login Controller)
        // We do this because 'generateAccessToken()' does not exist in your model.
        const token = crypto.randomBytes(20).toString("hex");
        
        // 2. Save the token to the user in the database
        user.token = token;
        await user.save({ validateBeforeSave: false });

        // 3. Define the Client URL (Frontend)
        // I changed port 3000 -> 5173 because Vite usually runs on 5173
        const clientURL = process.env.NODE_ENV === "production" 
            ? "https://wandercall-wfwx.onrender.com" 
            : "http://localhost:5173"; 

        // 4. Redirect with the NEW token
        res.redirect(
        `${clientURL}/auth-success?token=${token}&name=${encodeURIComponent(user.name)}&username=${user.username}`
    );
        
        // --- FIX ENDS HERE ---
        
    } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(500).json({ message: "Internal Server Error during Google Auth" });
    }
  }
);

export default router;