import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Content } from "../models/Content.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateContentFromAI } from "../utils/ai.js";

const generateContent = asyncHandler(async (req, res) => {
    const { videoTitle, transcript } = req.body;

    if (!transcript || transcript.trim() === "") {
        throw new ApiError(400, "Transcript is required");
    }

    // 1. Send to Groq AI
    const aiResponse = await generateContentFromAI(transcript);

    // 2. Save to DB
    const content = await Content.create({
        userId: req.user._id,
        videoTitle: videoTitle || "Untitled Video",
        transcript,
        generatedTitle: aiResponse.title || "",
        generatedDescription: aiResponse.description || "",
        generatedCaption: aiResponse.caption || "",
        generatedHashtags: aiResponse.hashtags || "",
        generatedSummary: Array.isArray(aiResponse.summary) ? aiResponse.summary.join("\n") : (aiResponse.summary || "")
    });

    return res.status(201).json(
        new ApiResponse(201, content, "Content generated successfully")
    );
});

const getHistory = asyncHandler(async (req, res) => {
    const contents = await Content.find({ userId: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, contents, "Content history fetched successfully")
    );
});

export { generateContent, getHistory };
