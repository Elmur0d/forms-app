require('dotenv').config();
const express = require('express');
const app = express();

app.use(require('cors')());
app.use(express.json());

app.get('/api/test', (req, res) => {
  res.json({ message: "Backend works!" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));