import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        name: { type: String, required: true },
        
        email: { type: String, required: true, unique: true },

        username: { type: String, required: true, unique: true },

        password: { type: String, required: false },

        googleId: { type: String, unique: true, sparse: true },

        token: { type: String },
        
        history: [
            { type: Schema.Types.ObjectId, ref: "Meeting" }
        ]
    },
    { timestamps: true }
)

const User = mongoose.model("User", userSchema);

export { User };