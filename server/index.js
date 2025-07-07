import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import templateRoutes from './routes/templateRoutes.js';
import questionRoutes from './routes/questionRoutes.js';

const app = express();

const allowedOrigins = [
  'https://forms-app-rho.vercel.app',
  'http://localhost:5173'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
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