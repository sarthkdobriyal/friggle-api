const api_config = require('../config');
const { GoogleGenAI } = require("@google/genai");
require('dotenv').config();




const ai = new GoogleGenAI({
    apiKey: api_config.GEMINI_API_KEY, // Ensure you have set your API key in .env file
});





async function generateVideoVeo(prompt) {
    let operation = await ai.models.generateVideos({
        model: "veo-3.0-generate-preview",
        prompt: prompt,
        config: {
            aspectRatio: "16:9",
        },
    });

    while (!operation.done) {
        console.log("Waiting for operation to complete...");
        await new Promise((resolve) => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({
            operation: operation,
        }).catch((error) => {
            console.error("Error fetching operation status:", error);
            throw error;
        });
    }

    if (operation.error) {
        console.error("Error in operation:", operation.error);
        throw new Error(`Video generation failed: ${operation.error.message}`);
    }
    
    console.log("Operation completed successfully!", operation.response.generatedVideos);
    
    if (!operation.response?.generatedVideos?.length) {
        console.log("No videos generated.");
        throw new Error("No videos were generated");
    }

    // Return the first generated video URL with API key
    const firstVideo = operation.response.generatedVideos[0];
    const videoUrl = `${firstVideo.video?.uri}&key=${process.env.GEMINI_API_KEY}`;
    console.log(`Generated video URL: ${videoUrl}`);
    
    return videoUrl;
}


module.exports = {
  generateVideoVeo
}