import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import aiRoutes from './routes/ai';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.use('/api', aiRoutes);

app.get('/', (req, res) => {
    res.send('Surakshamitra Healthguard API is running');
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
