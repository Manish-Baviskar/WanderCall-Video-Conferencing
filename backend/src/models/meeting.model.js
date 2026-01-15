import mongoose, { Schema } from "mongoose";

const meetingSchema = new Schema(
    {
        meetingCode: { type: String, required: true },
        date: { type: Date, default: Date.now, required: true },
        attendees: [
            { 
                user: { type: Schema.Types.ObjectId, ref: "User" },
                joinTime: { type: Date, default: Date.now },
                leaveTime: { type: Date } // This will be null initially
            }
        ]
    }
)

const Meeting = mongoose.model("Meeting", meetingSchema);

export { Meeting };