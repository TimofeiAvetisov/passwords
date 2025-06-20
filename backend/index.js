const express = require('express');
const fs = require('fs');
const cors = require('cors');

const DATA_FILE = 'data.json';
let data = { topics: [] };

if (fs.existsSync(DATA_FILE)) {
  data = JSON.parse(fs.readFileSync(DATA_FILE));
}

const saveData = () => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

const app = express();
app.use(cors());
app.use(express.json());

// Получение списка тем
app.get('/api/topics', (req, res) => {
  res.json(data.topics);
});

// Создание новой темы
app.post('/api/topics', (req, res) => {
  const { name } = req.body;
  if (data.topics.find(t => t.name === name)) {
    return res.status(400).json({ error: 'Topic exists' });
  }
  const newTopic = { id: Date.now().toString(), name, fields: {} };
  data.topics.push(newTopic);
  saveData();
  res.json(newTopic);
});

// Добавление/обновление поля в теме
app.post('/api/topics/:id/fields', (req, res) => {
  const { id } = req.params;
  const { key, value } = req.body;
  const topic = data.topics.find(t => t.id === id);
  if (!topic) {
    return res.status(404).json({ error: 'Not found' });
  }
  topic.fields[key] = value;
  saveData();
  res.json(topic);
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));