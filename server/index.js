// server/index.js
import express from 'express';
import authRoutes from './routes/auth.js'; 
import templateRoutes from './routes/templateRoutes.js';
import questionRoutes from './routes/questionRoutes.js';


const app = express();


app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/questions', questionRoutes); 


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));