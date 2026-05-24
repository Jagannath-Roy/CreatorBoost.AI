import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Content } from "../models/Content.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateContentFromAI } from "../utils/ai.js";
import fs from "fs";
import Groq from "groq-sdk";
import { toFile } from "groq-sdk";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


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
        generatedSummary: Array.isArray(aiResponse.summary) ? aiResponse.summary.join("\n") : (aiResponse.summary || ""),
        generatedTimestamps: aiResponse.timestamps || ""
    });

    const responseContent = {
        ...content.toJSON(),
        thumbnail: "coming_soon"
    };

    return res.status(201).json(
        new ApiResponse(201, responseContent, "Content generated successfully")
    );
});

const getHistory = asyncHandler(async (req, res) => {
    const contents = await Content.find({ userId: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, contents, "Content history fetched successfully")
    );
});

const getUploadSignature = asyncHandler(async (req, res) => {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = "creatorboost/temp_videos";
    
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    console.log("DEBUG [Upload Signature]: Generating signature...");
    console.log("DEBUG [Upload Signature]: Secret exists?", !!apiSecret);
    if (apiSecret) {
        console.log("DEBUG [Upload Signature]: Secret Length:", apiSecret.length);
        console.log("DEBUG [Upload Signature]: Secret Starts With:", apiSecret.substring(0, 3));
    } else {
        console.error("CRITICAL: CLOUDINARY_API_SECRET is undefined in this environment!");
    }

    const signature = cloudinary.utils.api_sign_request(
        {
            timestamp: timestamp,
            folder: folder
        },
        apiSecret
    );

    return res.status(200).json(
        new ApiResponse(200, {
            timestamp,
            signature,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.CLOUDINARY_API_KEY,
            folder
        }, "Signature generated successfully")
    );
});

const generateFromVideo = asyncHandler(async (req, res) => {
    const { videoTitle, secure_url, public_id } = req.body;
    
    if (!secure_url || !public_id) {
        throw new ApiError(400, "Cloudinary secure_url and public_id are required");
    }

    try {
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        
        // 1. Fetch file directly from Cloudinary URL, extracting ONLY the audio layer
        // by changing the extension to .mp3. This bypasses Groq's 25MB file size limit
        // since audio is significantly smaller than the full 100MB video.
        const audioUrl = secure_url.replace(/\.[^/.]+$/, ".mp3");
        const videoResponse = await fetch(audioUrl);
        if (!videoResponse.ok) {
            throw new ApiError(500, "Failed to download audio stream from Cloudinary");
        }

        // Convert the fetch response to a file-like object for the Groq SDK
        const fileForGroq = await toFile(videoResponse.body, "audio.mp3");

        // 2. Send file to Groq Whisper for transcription
        const transcription = await groq.audio.transcriptions.create({
            file: fileForGroq,
            model: "whisper-large-v3",
            response_format: "json", // Optional, defaults to json
            language: "en", // Optional, depending on use case
        });

        const transcriptText = transcription.text;

        if (!transcriptText || transcriptText.trim() === "") {
            throw new ApiError(500, "Failed to extract transcript from the file");
        }

        // 3. Feed the transcript to existing Llama 3 logic
        const aiResponse = await generateContentFromAI(transcriptText);

        // 4. Save to DB
        const content = await Content.create({
            userId: req.user._id,
            videoTitle: videoTitle || "Uploaded Video",
            transcript: transcriptText,
            generatedTitle: aiResponse.title || "",
            generatedDescription: aiResponse.description || "",
            generatedCaption: aiResponse.caption || "",
            generatedHashtags: aiResponse.hashtags || "",
            generatedSummary: Array.isArray(aiResponse.summary) ? aiResponse.summary.join("\n") : (aiResponse.summary || ""),
            generatedTimestamps: aiResponse.timestamps || ""
        });

        const responseContent = {
            ...content.toJSON(),
            thumbnail: "coming_soon"
        };

        return res.status(201).json(
            new ApiResponse(201, { content: responseContent, transcript: transcriptText }, "Video processed and content generated successfully")
        );
    } catch (error) {
        console.error("Error in generateFromVideo:", error);
        throw new ApiError(500, error.message || "Failed to process video and generate content");
    } finally {
        // Always completely wipe the video off Cloudinary space
        if (public_id) {
            try {
                await cloudinary.uploader.destroy(public_id, { resource_type: 'video' });
                console.log(`Successfully cleaned up video ${public_id} from Cloudinary.`);
            } catch (cleanupError) {
                console.error(`Failed to clean up video ${public_id} from Cloudinary:`, cleanupError);
            }
        }
    }
});
const deleteHistoryItem = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const content = await Content.findOneAndDelete({
        _id: id,
        userId: req.user._id
    });

    if (!content) {
        throw new ApiError(404, "History item not found or you are not authorized to delete it");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Content history deleted successfully")
    );
});

export { generateContent, getHistory, generateFromVideo, deleteHistoryItem, getUploadSignature };
