import Groq from "groq-sdk";
import { ApiError } from "./ApiError.js";

const generateContentFromAI = async (transcript) => {
    try {
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        
        const prompt = `
        You are an expert YouTube strategist and content creator. I will provide you with a video transcript.
        Based on this transcript, generate the following content optimized for YouTube virality and SEO:
        1. A catchy YouTube title (under 70 characters).
        2. An SEO-friendly description (summarizing the video and including a call to action).
        3. A viral caption for short-form platforms (TikTok/Reels/Shorts).
        4. Relevant hashtags (space separated).
        5. A short summary of the main points (3-4 bullet points).

        Return ONLY a raw JSON object with the following keys, with no extra text or markdown formatting outside of the JSON structure:
        {
            "title": "",
            "description": "",
            "caption": "",
            "hashtags": "",
            "summary": ""
        }

        Transcript:
        "${transcript}"
        `;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: "llama3-8b-8192", // Using a fast, free tier model
            temperature: 0.7,
            max_tokens: 1024,
            top_p: 1,
            stream: false,
            response_format: { type: "json_object" }
        });

        const responseContent = chatCompletion.choices[0]?.message?.content;
        return JSON.parse(responseContent);

    } catch (error) {
        console.error("Groq AI Error:", error);
        throw new ApiError(500, "Failed to generate content from AI");
    }
};

export { generateContentFromAI };
