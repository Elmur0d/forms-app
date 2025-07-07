import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import templateRoutes from './routes/templateRoutes.js';
import questionRoutes from './routes/questionRoutes.js';

const app = express();

const corsOptions = {
  origin: 'forms-7xzcdxa4m-elmur0ds-projects.vercel.app', 
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json());


app.get('/api', (req, res) => {
  res.send('Hello from Server!');
});


app.use('/api/auth', authRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/questions', questionRoutes);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));