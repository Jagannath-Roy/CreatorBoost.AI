import mongoose, { Schema } from 'mongoose';

const contentSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        videoTitle: {
            type: String,
            trim: true
        },
        transcript: {
            type: String,
            required: true
        },
        generatedTitle: {
            type: String
        },
        generatedDescription: {
            type: String
        },
        generatedCaption: {
            type: String
        },
        generatedHashtags: {
            type: String
        },
        generatedSummary: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

export const Content = mongoose.model("Content", contentSchema);
