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
    // Note: GET requests usually send data in 'query', not 'body'
    const { token } = req.query; 

    try {
        const user = await User.findOne({ token: token })
            .populate({
                path: 'history',
                populate: {
                    path: 'attendees',
                    select: 'name username' // Only fetch safe data
                }
            });

        if (!user) {
            return res.status(404).json({ message: "User not found or invalid token" });
        }

        // Return the populated history (meetings + attendee info)
        // Reverse it so the newest meetings show up first
        res.json(user.history.reverse());
        
    } catch (e) {
        res.json({ message: `Something went wrong ${e}` })
    }
}

const addToHistory = async (req, res) => {
    const { token, meeting_code } = req.body;

    try {
        const user = await User.findOne({ token: token });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // --- NEW: SANITIZATION LOGIC ---
        // If the code is a full URL (contains "/"), take only the last part.
        // If it's already just a code (e.g., "abc"), it stays "abc".
        const cleanMeetingCode = meeting_code.includes("/") 
            ? meeting_code.split("/").pop() 
            : meeting_code;
        // -------------------------------

        // Use 'cleanMeetingCode' everywhere below instead of 'meeting_code'
        let meeting = await Meeting.findOne({ meetingCode: cleanMeetingCode });

        if (!meeting) {
            meeting = new Meeting({
                meetingCode: cleanMeetingCode,
                attendees: []
            });
        }

        if (!meeting.attendees.includes(user._id)) {
            meeting.attendees.push(user._id);
            await meeting.save();
        }

        await User.findByIdAndUpdate(user._id, { 
            $addToSet: { history: meeting._id } 
        });

        res.status(201).json({ message: "Added to history" });

    } catch (e) {
        res.status(500).json({ message: `Something went wrong ${e}` });
    }
}


export { login, register, getUserHistory, addToHistory }