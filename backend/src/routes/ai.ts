import { Router } from 'express';
import { GeminiService } from '../services/geminiService';

const router = Router();

router.get('/daily-content', async (req, res) => {
    const content = await GeminiService.getDailyContent();
    res.json(content);
});

router.post('/soothing-voice', async (req, res) => {
    const { userText } = req.body;
    const audio = await GeminiService.getSoothingVoice(userText);
    res.json({ audio });
});

router.post('/analyze-mood', async (req, res) => {
    const { text } = req.body;
    const insight = await GeminiService.analyzeMoodInsight(text);
    res.json(insight);
});

router.post('/check-symptoms', async (req, res) => {
    const { symptoms } = req.body;
    const analysis = await GeminiService.checkSymptoms(symptoms);
    res.json({ text: analysis });
});

router.post('/chat', async (req, res) => {
    const { history, newMessage } = req.body;
    const response = await GeminiService.chatWithAssistant(history, newMessage);
    res.json({ text: response });
});

router.post('/analyze-personality', async (req, res) => {
    const { qa } = req.body;
    const result = await GeminiService.analyzePersonality(qa);
    res.json(result);
});

router.post('/analyze-prescription', async (req, res) => {
    const { image } = req.body; // base64 string
    const analysis = await GeminiService.analyzePrescription(image);
    res.json({ text: analysis });
});

router.post('/analyze-xray', async (req, res) => {
    const { image } = req.body; // base64 string
    const analysis = await GeminiService.analyzeXray(image);
    res.json({ text: analysis });
});

router.post('/find-nearby', async (req, res) => {
    const { query, location } = req.body;
    const results = await GeminiService.findNearbyPlaces(query, location);
    res.json({ text: results });
});

router.post('/generate-image', async (req, res) => {
    const { prompt, aspectRatio } = req.body;
    const image = await GeminiService.generateWellnessImage(prompt, aspectRatio);
    res.json({ image });
});

router.post('/generate-workout', async (req, res) => {
    const { target, difficulty } = req.body;
    const workout = await GeminiService.generateWorkout(target, difficulty);
    res.json(workout);
});

export default router;
