import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import templateRoutes from './routes/templateRoutes.js';
import questionRoutes from './routes/questionRoutes.js';

const app = express();

app.use(cors());

app.use(express.json());


app.get('/api', (req, res) => {
  res.send('Hello from Server!');
});


app.use('/api/auth', authRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/questions', questionRoutes);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));