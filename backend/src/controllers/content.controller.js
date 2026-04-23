import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Content } from "../models/Content.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateContentFromAI } from "../utils/ai.js";
import fs from "fs";
import Groq from "groq-sdk";


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

const generateFromVideo = asyncHandler(async (req, res) => {
    const { videoTitle } = req.body;
    
    if (!req.file) {
        throw new ApiError(400, "Video or audio file is required");
    }

    try {
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        
        // 1. Send file to Groq Whisper for transcription
        const transcription = await groq.audio.transcriptions.create({
            file: fs.createReadStream(req.file.path),
            model: "whisper-large-v3",
            response_format: "json", // Optional, defaults to json
            language: "en", // Optional, depending on use case
        });

        const transcriptText = transcription.text;

        if (!transcriptText || transcriptText.trim() === "") {
            throw new ApiError(500, "Failed to extract transcript from the file");
        }

        // 2. Feed the transcript to existing Llama 3 logic
        const aiResponse = await generateContentFromAI(transcriptText);

        // 3. Save to DB
        const content = await Content.create({
            userId: req.user._id,
            videoTitle: videoTitle || req.file.originalname,
            transcript: transcriptText,
            generatedTitle: aiResponse.title || "",
            generatedDescription: aiResponse.description || "",
            generatedCaption: aiResponse.caption || "",
            generatedHashtags: aiResponse.hashtags || "",
            generatedSummary: Array.isArray(aiResponse.summary) ? aiResponse.summary.join("\n") : (aiResponse.summary || "")
        });

        return res.status(201).json(
            new ApiResponse(201, { content, transcript: transcriptText }, "Video processed and content generated successfully")
        );
    } catch (error) {
        console.error("Error in generateFromVideo:", error);
        throw new ApiError(500, error.message || "Failed to process video and generate content");
    } finally {
        // Always clean up the temporary uploaded file
        if (req.file && req.file.path) {
            fs.unlinkSync(req.file.path);
        }
    }
});

export { generateContent, getHistory, generateFromVideo };
