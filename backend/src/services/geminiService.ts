import { GoogleGenAI, Modality, Type, Chat } from "@google/genai";
import { WorkoutPlan, ChatMessage } from "../types";
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const GeminiService = {
    async getDailyContent(): Promise<{ quote: string; joke: string }> {
        try {
            const model = "gemini-2.5-flash";
            const response = await ai.models.generateContent({
                model,
                contents: "Generate a motivational health quote and a refreshing short clean joke.",
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            quote: { type: Type.STRING },
                            joke: { type: Type.STRING }
                        }
                    }
                }
            });
            const text = response.text || "{}";
            return JSON.parse(text);
        } catch (error) {
            console.error("Gemini Quote Error:", error);
            return { quote: "Health is wealth.", joke: "Why did the gym close? It just didn't work out!" };
        }
    },

    async getSoothingVoice(userText: string): Promise<string | null> {
        try {
            const model = "gemini-2.5-flash-preview-tts";
            const response = await ai.models.generateContent({
                model,
                contents: `Speak in a very calm, soothing, therapeutic voice. Address this user concern safely and supportively: "${userText}". Keep it under 30 seconds.`,
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: {
                            prebuiltVoiceConfig: { voiceName: 'Kore' },
                        },
                    },
                },
            });

            const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            return base64Audio || null;
        } catch (error) {
            console.error("Gemini TTS Error:", error);
            return null;
        }
    },

    async analyzeMoodInsight(text: string): Promise<any> {
        try {
            const model = "gemini-2.5-flash";
            const response = await ai.models.generateContent({
                model,
                contents: `Analyze this user's reflection for mental wellness insights. User text: "${text}".
        Return JSON with:
        - sentiment: (Positive, Neutral, Negative, Mixed)
        - tone: 1-2 words describing the emotional tone (e.g., Anxious, Hopeful)
        - themes: Array of 1-3 key topics found
        - insight: A supportive, psychological observation or suggestion (max 2 sentences).`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            sentiment: { type: Type.STRING },
                            tone: { type: Type.STRING },
                            themes: { type: Type.ARRAY, items: { type: Type.STRING } },
                            insight: { type: Type.STRING },
                        },
                    },
                },
            });
            return JSON.parse(response.text || "{}");
        } catch (error) {
            console.error("Gemini Analysis Error:", error);
            return null;
        }
    },

    async checkSymptoms(symptoms: string): Promise<string> {
        try {
            const model = "gemini-3-pro-preview";
            const systemInstruction = "You are HealthGuard, an advanced medical AI assistant. Provide detailed, professional, and empathetic health insights based on the symptoms. Explain potential causes clearly and offer practical care advice. Maintain a supportive and authoritative tone.";

            const response = await ai.models.generateContent({
                model,
                contents: symptoms,
                config: {
                    systemInstruction,
                    thinkingConfig: { thinkingBudget: 32768 }
                }
            });
            return response.text || "I'm having trouble connecting. Please consult a doctor.";
        } catch (error) {
            console.error("Gemini Symptom Error:", error);
            return "Service unavailable. Please see a doctor.";
        }
    },

    async chatWithAssistant(history: ChatMessage[], newMessage: string): Promise<string> {
        try {
            const model = "gemini-3-pro-preview";

            const systemInstruction = `You are HealthGuard Pro, the intelligent assistant for the SurakshaMitra HealthGuard app.
          
          **App Capabilities & Features:**
          1. **Dashboard**: Tracks daily steps, sleep quality, and 'Suraksha Coins' (rewards). Shows daily quotes/jokes.
          2. **Personality Hub**: A creative quiz that determines a user's unique archetype (e.g., "The Radiant Guardian").
          3. **Mental Wellness**: 
             - **Visual Sanctuary**: Generates calming AI images (e.g. landscapes) to reduce stress.
             - **Mood Analysis**: Analyzes feelings and provides insights (sentiment/tone).
             - **Soothing Voice**: Generates therapeutic audio advice.
             - **Zen Games**: A memory match game to improve focus.
          4. **Physical Wellness**:
             - **Workout Generator**: Creates custom exercise routines (e.g. Abs, Legs) based on user difficulty.
             - **Deep Focus**: A timer mode to block distractions.
          5. **Medical Assistant**:
             - **Symptom Checker**: Uses 'Thinking Mode' for deep reasoning on symptoms.
             - **Medical Scanner**: Analyzes images of Prescriptions (dosage/instructions) and X-Rays (bone structure).
             - **Appointments**: Timeline to schedule and track doctor visits with reminders.
             - **Find Nearby**: Uses Google Maps to locate doctors, pharmacies, and gyms.
          
          **Your Role:**
          - Answer questions about how to use these specific features.
          - Provide general health advice (sleep, diet, exercise).
          - Be concise, warm, professional, and empathetic.
          - If the user asks about a feature (like "How do I scan an X-ray?"), guide them to the Medical Assistant tab -> Scanner.
          `;

            const chat: Chat = ai.chats.create({
                model,
                config: { systemInstruction }
            });

            const conversationContext = history.slice(-5).map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`).join('\n');
            const fullPrompt = history.length > 0
                ? `Previous Conversation:\n${conversationContext}\n\nCurrent User Question: ${newMessage}`
                : newMessage;

            const result = await chat.sendMessage({ message: fullPrompt });
            return result.text || "I'm listening...";
        } catch (error) {
            console.error("Chat Error:", error);
            return "I'm having trouble connecting right now.";
        }
    },

    async analyzePersonality(qa: { question: string, answer: string }[]): Promise<any> {
        try {
            const model = "gemini-3-pro-preview";
            const prompt = `Analyze these personality quiz answers: ${JSON.stringify(qa)}. 
        Determine a creative, uplifting personality archetype (e.g., "The Cosmic Healer", "The Quantum Architect", "The Serene Warrior").
        Return JSON with:
        {
            "archetype": "Title Name",
            "emoji": "Single Representative Emoji",
            "traits": ["Trait 1", "Trait 2", "Trait 3"],
            "description": "A 2-sentence deep psychological description.",
            "message": "A short, exciting, and empowering message for the user."
        }`;

            const response = await ai.models.generateContent({
                model,
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            archetype: { type: Type.STRING },
                            emoji: { type: Type.STRING },
                            traits: { type: Type.ARRAY, items: { type: Type.STRING } },
                            description: { type: Type.STRING },
                            message: { type: Type.STRING }
                        }
                    }
                }
            });
            return JSON.parse(response.text || "{}");
        } catch (error) {
            console.error("Personality Analysis Error:", error);
            return {
                archetype: "The Digital Pioneer",
                emoji: "🚀",
                traits: ["Curious", "Resilient", "Forward-thinking"],
                description: "You are exploring new frontiers of health and technology.",
                message: "Keep pushing boundaries!"
            };
        }
    },

    async analyzePrescription(base64Image: string): Promise<string> {
        try {
            const model = "gemini-3-pro-preview";
            const response = await ai.models.generateContent({
                model,
                contents: {
                    parts: [
                        {
                            inlineData: { mimeType: "image/png", data: base64Image }
                        },
                        {
                            text: "Analyze this medical prescription image. Extract and list the medications, specific dosages, frequency, and any special instructions in a clear, structured format."
                        }
                    ]
                }
            });
            return response.text || "Could not analyze image.";
        } catch (error) {
            console.error("Gemini Vision Error:", error);
            return "Unable to process the image. Please try again.";
        }
    },

    async analyzeXray(base64Image: string): Promise<string> {
        try {
            const model = "gemini-3-pro-preview";
            const response = await ai.models.generateContent({
                model,
                contents: {
                    parts: [
                        {
                            inlineData: { mimeType: "image/png", data: base64Image }
                        },
                        {
                            text: "Conduct a detailed technical analysis of this medical X-ray. Identify the anatomical region. Describe the bone structure, alignment, and any visible anomalies or fractures using precise medical terminology. Provide a professional structural observation."
                        }
                    ]
                }
            });
            return response.text || "Could not analyze X-ray.";
        } catch (error) {
            console.error("Gemini Xray Error:", error);
            return "Unable to process the X-ray image.";
        }
    },

    async findNearbyPlaces(query: string, location: { lat: number, lng: number }): Promise<string> {
        try {
            const model = "gemini-2.5-flash";
            const response = await ai.models.generateContent({
                model,
                contents: `Find ${query} near the provided location.`,
                config: {
                    tools: [{ googleMaps: {} }],
                    toolConfig: {
                        retrievalConfig: {
                            latLng: {
                                latitude: location.lat,
                                longitude: location.lng
                            }
                        }
                    }
                }
            });
            return response.text || "No places found nearby.";
        } catch (error) {
            console.error("Gemini Maps Error:", error);
            return "Unable to access location services at this time.";
        }
    },

    async generateWellnessImage(prompt: string, aspectRatio: string): Promise<string | null> {
        try {
            const model = "gemini-3-pro-image-preview";
            const response = await ai.models.generateContent({
                model,
                contents: { parts: [{ text: prompt }] },
                config: {
                    imageConfig: { aspectRatio: aspectRatio as any }
                }
            });

            for (const part of response.candidates?.[0]?.content?.parts || []) {
                if (part.inlineData) {
                    return `data:image/png;base64,${part.inlineData.data}`;
                }
            }
            return null;
        } catch (error) {
            console.error("Gemini Image Gen Error:", error);
            return null;
        }
    },

    async generateWorkout(target: string, difficulty: string): Promise<WorkoutPlan | null> {
        try {
            const model = "gemini-2.5-flash";
            const prompt = `Create a ${difficulty} home workout routine focusing on ${target}. Return JSON.`;
            const response = await ai.models.generateContent({
                model,
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            exercises: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        name: { type: Type.STRING },
                                        sets: { type: Type.NUMBER },
                                        reps: { type: Type.STRING },
                                        description: { type: Type.STRING }
                                    }
                                }
                            }
                        }
                    }
                }
            });

            if (response.text) {
                return JSON.parse(response.text) as WorkoutPlan;
            }
            return null;
        } catch (e) {
            console.error(e);
            return null;
        }
    }
};
