import httpStatus from "http-status";
import { User } from "../models/user.model.js";
import bcrypt, { hash } from "bcrypt";

import crypto from "crypto";
import { Meeting } from "../models/meeting.model.js";


const login = async (req, res) => {
    const { username, password } = req.body; // Removed 'name' (not needed for login)

    if (!username || !password) {
        return res.status(400).json({ message: "Please provide Username and Password" });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
        }

        // --- NEW SAFETY CHECK FOR GOOGLE USERS ---
        // If user registered via Google, they have no password.
        if (!user.password) {
            return res.status(400).json({ 
                message: "This account uses Google Sign-In. Please login with Google." 
            });
        }
        // ------------------------------------------

        let isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (isPasswordCorrect) {
            let token = crypto.randomBytes(20).toString("hex");
            user.token = token;
            await user.save();
            return res.status(httpStatus.OK).json({ token: token, name: user.name, username: user.username, email: user.email });
        } else {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid Username or password" });
        }
    } catch (e) {
        console.log("LOGIN ERROR DETAILS:", e);
        return res.status(500).json({ message: `Something went wrong ${e}` });
    }
}

const register = async (req, res) => {
    // 1. Add 'email' to destructuring (Standard for modern auth)
    const { name, username, password, email } = req.body;

    try {
        // --- SECURITY CHECK START ---
        // Since DB model has `password: { required: false }`, we MUST check it here.
        if (!password) {
            return res.status(400).json({ message: "Password is required for registration" });
        }
        // --- SECURITY CHECK END ---

        if (!username || !name || !email) {
            return res.status(400).json({ message: "All fields (Name, Username, Email) are required" });
        }

        // 2. Check if Username OR Email already exists
        const existingUser = await User.findOne({ 
            $or: [{ username }, { email }] 
        });

        if (existingUser) {
            console.log("FOUND DUPLICATE USER:", existingUser);
            return res.status(httpStatus.CONFLICT).json({ message: "User with this username or email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name: name,
            username: username,
            email: email, // Don't forget to save the email!
            password: hashedPassword,
        });

        await newUser.save();

        res.status(httpStatus.CREATED).json({ message: "User Registered Successfully" });

    } catch (e) {
        console.log(e);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Something went wrong: ${e}` });
    }
}

const getUserHistory = async (req, res) => {
    const { token } = req.query;

    try {
        const user = await User.findOne({ token: token })
            .populate({
                path: 'history',
                populate: {
                    path: 'attendees.user', // Populate the nested user object
                    select: 'name username'
                }
            });

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user.history.reverse());
    } catch (e) {
        res.status(500).json({ message: `Error: ${e}` });
    }
}

const addToHistory = async (req, res) => {
    const { token, meeting_code } = req.body;

    try {
        const user = await User.findOne({ token: token });
        if (!user) return res.status(404).json({ message: "User not found" });

        const cleanMeetingCode = meeting_code.includes("/") ? meeting_code.split("/").pop() : meeting_code;

        let meeting = await Meeting.findOne({ meetingCode: cleanMeetingCode });

        if (!meeting) {
            meeting = new Meeting({
                meetingCode: cleanMeetingCode,
                attendees: []
            });
        }

        // --- UPDATED: Add User Object with Join Time ---
        // Check if user is already in the list to prevent duplicates
        const existingAttendee = meeting.attendees.find(a => a.user.toString() === user._id.toString());
        
        if (!existingAttendee) {
            meeting.attendees.push({
                user: user._id,
                joinTime: new Date(),
                leaveTime: null 
            });
            await meeting.save();
        }

        await User.findByIdAndUpdate(user._id, { $addToSet: { history: meeting._id } });

        res.status(201).json({ message: "Added to history" });

    } catch (e) {
        res.status(500).json({ message: `Error: ${e}` });
    }
}

const updateLeaveTime = async (req, res) => {
    try {
        const { token, meeting_code } = req.body;
        
        console.log("--- LEAVE REQUEST RECEIVED ---");
        console.log("Token:", token ? "Exists" : "Missing");
        console.log("Meeting Code Raw:", meeting_code);

        // 1. Validate Input
        if (!token || !meeting_code) {
            console.log("Error: Missing Data");
            return res.status(400).json({ message: "Missing token or meeting_code" });
        }

        // 2. Find User
        const user = await User.findOne({ token: token });
        if (!user) {
            console.log("Error: User Not Found for token");
            return res.status(404).json({ message: "User not found" });
        }

        // 3. Clean Code & Find Meeting
        const cleanMeetingCode = meeting_code.includes("/") ? meeting_code.split("/").pop() : meeting_code;
        console.log("Clean Meeting Code:", cleanMeetingCode);

        const meeting = await Meeting.findOne({ meetingCode: cleanMeetingCode });
        if (!meeting) {
            console.log("Error: Meeting Not Found");
            return res.status(404).json({ message: "Meeting not found" });
        }

        // 4. Update Attendee
        const attendeeIndex = meeting.attendees.findIndex(a => a.user.toString() === user._id.toString());
        
        if (attendeeIndex !== -1) {
            meeting.attendees[attendeeIndex].leaveTime = new Date();
            await meeting.save();
            console.log("SUCCESS: Leave time updated for", user.username);
            return res.status(200).json({ message: "Leave time updated" });
        } else {
            console.log("Error: User was not in attendee list");
            return res.status(404).json({ message: "User not participant in this meeting" });
        }

    } catch (e) {
        console.error("CRITICAL SERVER ERROR:", e); // <--- This will show in Render Logs
        return res.status(500).json({ message: `Server Error: ${e.message}` });
    }
}


export { login, register, getUserHistory, addToHistory, updateLeaveTime }