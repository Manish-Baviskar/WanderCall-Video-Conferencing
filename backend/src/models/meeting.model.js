import mongoose, { Schema } from "mongoose";

const meetingSchema = new Schema(
    {
        meetingCode: { type: String, required: true },
        date: { type: Date, default: Date.now, required: true },
        attendees: [
            { type: Schema.Types.ObjectId, ref: "User" }
        ]
    }
)

const Meeting = mongoose.model("Meeting", meetingSchema);

export { Meeting };