import httpStatus from "http-status";
import { User } from "../models/user.model.js";
import bcrypt, { hash } from "bcrypt";

import crypto from "crypto";
import { Meeting } from "../models/meeting.model.js";


const login = async (req, res) => {
    const { name, username, password } = req.body;

    if(!username || !password){
        return res.status(400).json({message: "Please provide"});
    }

    try{
        const user = await User.findOne({username});
        if(!user){
            return res.status(httpStatus.NOT_FOUND).json({message: "User not found"});
        }

        let isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (isPasswordCorrect) {
            let token = crypto.randomBytes(20).toString("hex");

            user.token = token;
            await user.save();
            return res.status(httpStatus.OK).json({ token: token });
        } else{
            return res.status(httpStatus.UNAUTHORIZED).json({message: "Invalid Username or password"});
        }
    }
    catch(e){
        console.log("LOGIN ERROR DETAILS:", e);
        return res.status(500).json({message: `Something went wrong ${e}`});
    }
}

const register = async (req, res) => {

    const { name, username, password } = req.body;

    try{
        if (!username) {
            console.log("❌ Username is missing!");
            return res.status(400).json({ message: "Username is required" });
        }

        const existingUser = await User.findOne({username});
        if(existingUser){
            console.log("FOUND USER IN DB:", existingUser);
            return res.status(httpStatus.CONFLICT).json({message: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name: name,
            username: username,
            password: hashedPassword
        });

        await newUser.save();

        res.status(httpStatus.CREATED).json({message: "User Registered"});

    } 
    catch(e){
        console.log(e);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: `Something went wrong: ${e}`});
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
    // 1. Log the incoming request (Helps debugging in Render Logs)
    const { token, meeting_code } = req.body;
    console.log("updateLeaveTime called with:", { token, meeting_code });

    try {
        // 2. Validate Input
        if (!token || !meeting_code) {
            return res.status(400).json({ message: "Token and Meeting Code are required" });
        }

        const user = await User.findOne({ token: token });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 3. Clean the Code (Handle full URL or just code)
        const cleanMeetingCode = meeting_code.includes("/") ? meeting_code.split("/").pop() : meeting_code;

        const meeting = await Meeting.findOne({ meetingCode: cleanMeetingCode });
        if (!meeting) {
            return res.status(404).json({ message: "Meeting not found" });
        }

        // 4. Find Attendee (Safety Check added)
        const attendeeIndex = meeting.attendees.findIndex(a => a.user.toString() === user._id.toString());
        
        if (attendeeIndex !== -1) {
            meeting.attendees[attendeeIndex].leaveTime = new Date();
            await meeting.save();
            console.log("Leave time saved for user:", user.username);
            return res.status(200).json({ message: "Leave time updated" });
        } else {
            return res.status(404).json({ message: "User not found in this meeting's attendee list" });
        }

    } catch (e) {
        console.error("CRITICAL ERROR in updateLeaveTime:", e);
        return res.status(500).json({ message: `Server Error: ${e.message}` });
    }
}


export { login, register, getUserHistory, addToHistory, updateLeaveTime }