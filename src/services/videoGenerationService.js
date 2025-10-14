const api_config = require('../config');
const { GoogleGenAI } = require("@google/genai");
const Bytez = require('bytez.js');
// const RunwayML = require('@runwayml/sdk');
// const { TaskFailedError } = require('@runwayml/sdk');
const Replicate = require('replicate');
require('dotenv').config();




const ai = new GoogleGenAI({
    apiKey: api_config.GEMINI_API_KEY, // Ensure you have set your API key in .env file
});

const bytezSdk = new Bytez(api_config.BYTEZ_KEY);

// const runwayClient = new RunwayML({ apiKey: api_config.RUNWAYML_API_SECRET });

const replicate = new Replicate({
    auth: api_config.REPLICATE_API_TOKEN,
});

// Add debug logging for Replicate auth
console.log('Replicate API Token exists:', !!api_config.REPLICATE_API_TOKEN);
console.log('Replicate API Token length:', api_config.REPLICATE_API_TOKEN?.length);

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

async function generateVideoBytez(prompt) {

    const model = bytezSdk.model('ali-vilab/text-to-video-ms-1.7b');


    const { error, output } = await model.run(prompt);

    if (error) {
        console.error("Error generating video with Bytez:", error);
        throw new Error(`Video generation failed: ${error.message}`);
    }
    console.log("Video generated successfully with Bytez:", output);
    return output;
}

// async function generateVideoEdenAi(prompt) {
//     const url = 'https://api.edenai.run/v2/video/generation_async/';
//     const options = {
//         method: 'POST',
//         headers: {
//             accept: 'application/json',
//             'content-type': 'application/json',
//             authorization: `Bearer ${api_config.EDEN_AI_KEY}` // Use config instead of hardcoded token
//         },
//         body: JSON.stringify({
//             show_original_response: false,
//             send_webhook_data: true,
//             show_base_64: true,
//             duration: 6,
//             fps: 24,
//             dimension: '1280x720',
//             seed: 12,
//             providers: ['bytedance/seedance-1-0-pro-250528'],
//             text: prompt
//         })
//     };

//     try {
//         // Initial request to start video generation
//         const response = await fetch(url, options);
//         const data = await response.json();

//         if (!response.ok) {
//             throw new Error(`EdenAI API error: ${data.message || response.statusText}`);
//         }

//         console.log("Video generation started:", data);

//         // Get the job ID to poll for completion
//         const jobId = data.public_id;
//         if (!jobId) {
//             throw new Error("No job ID returned from EdenAI");
//         }

//         // Poll for completion
//         const statusUrl = `https://api.edenai.run/v2/video/generation_async/${jobId}/`;
//         const statusOptions = {
//             method: 'GET',
//             headers: {
//                 accept: 'application/json',
//                 authorization: `Bearer ${api_config.EDEN_AI_KEY}`
//             }
//         };

//         let completed = false;
//         let attempts = 0;
//         const maxAttempts = 60; // 5 minutes with 5-second intervals

//         while (!completed && attempts < maxAttempts) {
//             await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds

//             const statusResponse = await fetch(statusUrl, statusOptions);
//             const statusData = await statusResponse.json();

//             console.log(`Checking video generation status (attempt ${attempts + 1}):`, statusData);

//             if (statusData.status === 'finished') {
//                 completed = true;

//                 // Extract video URL from response
//                 if (statusData.results) {
//                     const videoUrl = statusData.results.video || statusData.results.video_resource_url;
//                     console.log("Video generated successfully:", videoUrl);
//                     return videoUrl;
//                 } else {
//                     throw new Error("No video URL found in successful response");
//                 }
//             } else if (statusData.status === 'failed') {
//                 throw new Error(`Video generation failed: ${statusData.error || 'Unknown error'}`);
//             }

//             attempts++;
//         }

//         if (!completed) {
//             throw new Error("Video generation timed out after 5 minutes");
//         }

//     } catch (error) {
//         console.error("Error generating video with EdenAI:", error);
//         throw new Error(`EdenAI video generation failed: ${error.message}`);
//     }
// }

// async function generateVideoRunwayML(prompt) {
//     const task = await runwayClient.textToVideo
//         .create({
//             model: 'veo3',
//             promptText: prompt,
//             duration: 8,
//             ratio: '1280:720',
//         })
//         .waitForTaskOutput();


//     console.log("Video generated successfully with RunwayML:", task);
//     return task.output.videoUrl;

// }

async function generateVideoReplicate(prompt, selectedModel) {
    const modelConfigs = {
        "bytedance/seedance-1-pro": {
            name: "bytedance/seedance-1-pro",
            input: {
                prompt: prompt,
                duration: 6,
                fps: 24,
                resolution: "480p"
            }
        },
        "black-forest-labs/flux-kontext-pro": {
            name: "black-forest-labs/flux-kontext-pro:latest",
            input: {
                prompt: prompt,
                num_frames: 144,
                fps: 24,
                aspect_ratio: "16:9"
            }
        },
        "leonardoai/motion-2.0": {
            name: "leonardoai/motion-2.0",
            input: {
                "prompt": prompt,
                "vibe_style": "None",
                "aspect_ratio": "16:9",
                "lighting_style": "None",
                "prompt_enhance": true,
                "shot_type_style": "None",
                "color_theme_style": "None",
                "frame_interpolation": true
            }
        },
        "tencent/hunyuan-video": {
            name: "tencent/hunyuan-video:6c9132aee14409cd6568d030453f1ba50f5f3412b844fe67f78a9eb62d55664f",
            input: {
                prompt: prompt,
                video_length: 129,
                resolution: "720p",
                fps: 25
            }
        }
    };

    // Check if the selected model is supported
    if (!modelConfigs[selectedModel]) {
        throw new Error(`Unsupported model: ${selectedModel}. Available models: ${Object.keys(modelConfigs).join(', ')}`);
    }

    const modelConfig = modelConfigs[selectedModel];
    const modelName = modelConfig.name;

    try {
        console.log(`Generating video with ${selectedModel}...`, modelConfig);
        
        // Add authentication check
        if (!api_config.REPLICATE_API_TOKEN) {
            throw new Error('Replicate API token is not configured');
        }
        
        console.log('Using Replicate token:', api_config.REPLICATE_API_TOKEN.substring(0, 10) + '...');

        // Create prediction instead of run to get better control
        const prediction = await replicate.predictions.create({
            version: modelName.split(':')[1] || 'latest',
            input: modelConfig.input
        });

        console.log('Prediction created:', prediction.id);

        // Wait for prediction to complete
        let completedPrediction = prediction;
        while (completedPrediction.status !== 'succeeded' && completedPrediction.status !== 'failed') {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
            completedPrediction = await replicate.predictions.get(prediction.id);
            console.log(`Prediction status: ${completedPrediction.status}`);
        }

        if (completedPrediction.status === 'failed') {
            throw new Error(`Prediction failed: ${completedPrediction.error}`);
        }

        console.log('Prediction completed:', completedPrediction.output);

        // Extract video URL from completed prediction
        let videoUrl;
        const output = completedPrediction.output;

        if (typeof output === 'string') {
            videoUrl = output;
        } else if (Array.isArray(output) && output.length > 0) {
            videoUrl = output[0];
        } else if (output && typeof output === 'object') {
            videoUrl = output.video_url || output.video || output.url || output.output;
        } else if (output.url) {
            videoUrl = output.url;
        } else {
            throw new Error(`No video URL found in prediction output: ${JSON.stringify(output)}`);
        }

        if (!videoUrl || typeof videoUrl !== 'string') {
            throw new Error(`Invalid video URL received: ${videoUrl}`);
        }

        console.log(`Video URL received: ${videoUrl}`);
        return videoUrl;

    } catch (error) {
        console.error(`Full error details for ${selectedModel}:`, error);
        
        // Check if it's an authentication error
        if (error.message.includes('403') || error.message.includes('Forbidden')) {
            console.error('Authentication failed. Check Replicate API token.');
            throw new Error(`Authentication failed for ${selectedModel}. Please check your Replicate API credentials.`);
        }
        
        throw new Error(`Video generation failed with ${selectedModel}: ${error.message}`);
    }
}

async function generateVideoLeonardoAI(prompt, userId) {
    const modelConfig = {
        input: {
            "prompt": prompt,
            "vibe_style": "None",
            "aspect_ratio": "16:9",
            "lighting_style": "None",
            "prompt_enhance": true,
            "shot_type_style": "None",
            "color_theme_style": "None",
            "frame_interpolation": true
        }
    };

    try {
        console.log('Generating video with Leonardo AI Motion 2.0...', modelConfig);

        // Use predictions API for better control
        const prediction = await replicate.predictions.create({
            version: "leonardoai/motion-2.0",
            input: modelConfig.input
        });

        // Wait for prediction to complete
        let completedPrediction = prediction;
        while (completedPrediction.status !== 'succeeded' && completedPrediction.status !== 'failed') {
            await new Promise(resolve => setTimeout(resolve, 2000));
            completedPrediction = await replicate.predictions.get(prediction.id);
            console.log(`Leonardo prediction status: ${completedPrediction.status}`);
        }

        if (completedPrediction.status === 'failed') {
            throw new Error(`Leonardo prediction failed: ${completedPrediction.error}`);
        }

        const output = completedPrediction.output;
        let videoUrl;

        if (typeof output === 'string') {
            videoUrl = output;
        } else if (Array.isArray(output) && output.length > 0) {
            videoUrl = output[0];
        } else if (output && typeof output === 'object') {
            videoUrl = output.video_url || output.video || output.url || output.output;
        } else {
            throw new Error(`No video URL found in Leonardo output: ${JSON.stringify(output)}`);
        }

        console.log('Leonardo AI video URL received:', videoUrl);
        return videoUrl;

    } catch (error) {
        console.error('Error with Leonardo AI:', error.message);
        throw new Error(`Leonardo AI video generation failed: ${error.message}`);
    }
}


async function generateVideoBytedance(prompt) {
    try {
        // Add authentication check
        if (!api_config.REPLICATE_API_TOKEN) {
            throw new Error('Replicate API token is not configured');
        }
        
        console.log('Bytedance: Using Replicate token:', api_config.REPLICATE_API_TOKEN.substring(0, 10) + '...');
        
        const input = {
            prompt: prompt,
            duration: 6,
            fps: 24,
            resolution: "480p"
        };
        
        const output = await replicate.run("bytedance/seedance-1-pro", { input });

        // Handle different output formats
        if (typeof output === 'string') {
            return output;
        } else if (output && typeof output === 'object' && output.url) {
            return typeof output.url === 'function' ? output.url() : output.url;
        } else if (Array.isArray(output) && output.length > 0) {
            return output[0];
        } else {
            console.log('Bytedance output:', output);
            throw new Error('Unexpected output format from Bytedance model');
        }
        
    } catch (error) {
        console.error('Bytedance error:', error);
        
        if (error.message.includes('403') || error.message.includes('Forbidden')) {
            throw new Error('Authentication failed for Bytedance model. Please check your Replicate API credentials.');
        }
        
        throw new Error(`Bytedance video generation failed: ${error.message}`);
    }
}



async function enhancePrompt(user_input) {
    const system_prompt = "You are an expert Veo3 video prompt engineer specializing in creating natural, photorealistic video prompts that avoid AI-generated artifacts. Your role is to transform basic user requests into comprehensive, cinematic prompts that produce seamless, believable videos indistinguishable from real footage. Focus on natural movement, authentic lighting, realistic physics, and organic camera work that feels human-operated rather than artificially generated. Keep enhanced prompts concise yet detailed, typically 100-150 words maximum.";

    const user_prompt = `
        Transform the following video request into a masterful Veo3 prompt that generates completely natural, photorealistic footage. The result must look like authentic real-world video with no AI artifacts or unnatural elements. Include specific details about:

        - Natural lighting conditions with realistic shadows and reflections
        - Authentic character movements and reactions (no exaggerated expressions)
        - Environmental elements and background activity that feels organic
        - Color palette and visual tone that matches real-world conditions
        - Sound design elements implied through visual cues
        - Realistic timing and pacing of all actions and movements

        Original request: ${user_input}
        Example response prompt based on user input: A very crowded office elevator during morning rush hour. The doors are closed at the start of the video, and as they begin to slowly open, we hear soft elevator music from the ceiling speakers and a gentle mechanical hum. The camera holds a single, continuous, eye-level shot, focused tightly on two well-dressed colleagues standing face-to-face — uncomfortably close due to the packed space. Just as the elevator doors are halfway open, the man calmly and confidently says: “I once sneezed in the all-hands and clicked ‘share screen’ at the same time. No survivors.” The woman reacts with genuine laughter — amused but never exaggerated — and she never speaks, recoils, touches her face, or steps back. Around them, the other elevator passengers remain relaxed and detached: one scrolls on their phone, another stares forward in thought, someone else shifts their bag — but no one looks at or reacts to the main characters. The doors continue to open fully, and at the end of the shot, the two colleagues step out of the elevator while the camera stays fixed in place. The characters never look into the camera. Do not include any captions, subtitles, or on-screen text.
        (Refer above prompt only for reference it is not the output you should provide. You are required to enhance the user original prompt by following whatever it is mentioned in the prompt strictly.)

        Create a single, comprehensive enhanced prompt (100-150 words maximum) that reads naturally and produces footage indistinguishable from professionally shot real-world video. Focus on authenticity over spectacle.

        Output only the enhanced prompt - no explanations or additional text.
        `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: `
        ${system_prompt}

        ${user_prompt}
        `
    })

    console.log("Enhanced prompt generated successfully:", response.candidates[0].content);

    if (!response || !response.candidates || response.candidates.length === 0) {
        throw new Error("Failed to generate enhanced prompt");
    }

    return response.candidates[0].content; // Return the first candidate's content

}


module.exports = {
    generateVideoVeo,
    generateVideoBytez,
    // generateVideoEdenAi,
    // generateVideoRunwayML,
    generateVideoReplicate,
    generateVideoLeonardoAI,
    generateVideoBytedance,
    enhancePrompt
}