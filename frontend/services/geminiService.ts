import { WorkoutPlan, ChatMessage } from "../types";

// Base URL for the new backend server
// Provide fallback to standard vite localhost if VITE_BACKEND_URL isn't set
const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

/**
 * Helper to decode base64 audio for playback
 */
const decodeAudioData = async (
  base64Data: string,
  ctx: AudioContext
): Promise<AudioBuffer> => {
  const binaryString = atob(base64Data);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const dataInt16 = new Int16Array(bytes.buffer);
  const frameCount = dataInt16.length;
  const buffer = ctx.createBuffer(1, frameCount, 24000);
  const channelData = buffer.getChannelData(0);

  for (let i = 0; i < frameCount; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }

  return buffer;
};

export const GeminiService = {
  async getDailyContent(): Promise<{ quote: string; joke: string }> {
    try {
      const response = await fetch(`${BASE_URL}/daily-content`);
      return await response.json();
    } catch (error) {
      console.error("Gemini Quote Error:", error);
      return { quote: "Health is wealth.", joke: "Why did the gym close? It just didn't work out!" };
    }
  },

  async getSoothingVoice(userText: string): Promise<AudioBuffer | null> {
    try {
      const response = await fetch(`${BASE_URL}/soothing-voice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userText })
      });
      const { audio } = await response.json();

      if (!audio) return null;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass({ sampleRate: 24000 });
      return await decodeAudioData(audio, audioCtx);

    } catch (error) {
      console.error("Gemini TTS Error:", error);
      return null;
    }
  },

  async analyzeMoodInsight(text: string): Promise<{ sentiment: string; tone: string; themes: string[]; insight: string } | null> {
    try {
      const response = await fetch(`${BASE_URL}/analyze-mood`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      return await response.json();
    } catch (error) {
      console.error("Gemini Analysis Error:", error);
      return null;
    }
  },

  async checkSymptoms(symptoms: string): Promise<string> {
    try {
      const response = await fetch(`${BASE_URL}/check-symptoms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms })
      });
      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error("Gemini Symptom Error:", error);
      return "Service unavailable. Please see a doctor.";
    }
  },

  async chatWithAssistant(history: ChatMessage[], newMessage: string): Promise<string> {
    try {
      const response = await fetch(`${BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history, newMessage })
      });
      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error("Chat Error:", error);
      return "I'm having trouble connecting right now.";
    }
  },

  async analyzePersonality(qa: { question: string, answer: string }[]): Promise<{ archetype: string; emoji: string; traits: string[]; description: string; message: string } | null> {
    try {
      const response = await fetch(`${BASE_URL}/analyze-personality`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qa })
      });
      return await response.json();
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
      const response = await fetch(`${BASE_URL}/analyze-prescription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image })
      });
      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error("Gemini Vision Error:", error);
      return "Unable to process the image. Please try again.";
    }
  },

  async analyzeXray(base64Image: string): Promise<string> {
    try {
      const response = await fetch(`${BASE_URL}/analyze-xray`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image })
      });
      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error("Gemini Xray Error:", error);
      return "Unable to process the X-ray image.";
    }
  },

  async findNearbyPlaces(query: string, location: { lat: number, lng: number }): Promise<string> {
    try {
      const response = await fetch(`${BASE_URL}/find-nearby`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, location })
      });
      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error("Gemini Maps Error:", error);
      return "Unable to access location services at this time.";
    }
  },

  async generateWellnessImage(prompt: string, aspectRatio: string): Promise<string | null> {
    try {
      const response = await fetch(`${BASE_URL}/generate-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, aspectRatio })
      });
      const data = await response.json();
      return data.image;
    } catch (error) {
      console.error("Gemini Image Gen Error:", error);
      return null;
    }
  },

  async generateWorkout(target: string, difficulty: string): Promise<WorkoutPlan | null> {
    try {
      const response = await fetch(`${BASE_URL}/generate-workout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target, difficulty })
      });
      return await response.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  }
};