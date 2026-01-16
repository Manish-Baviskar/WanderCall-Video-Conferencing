import { Router } from "express";
import { addToHistory, getUserHistory, login, register, updateLeaveTime } from "../controllers/user.controller.js";
import passport from "passport";



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
  (req, res) => {
    
    const user = req.user;

    
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    const clientURL = process.env.NODE_ENV === "production" 
        ? "https://wandercall-wfwx.onrender.com"  // LIVE FRONTEND
        : "http://localhost:3000";

    
    res.redirect(`${clientURL}/auth-success?token=${user.token}`);
  }
);

export default router;