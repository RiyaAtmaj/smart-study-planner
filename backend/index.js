import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 4000;

const notesFile = path.resolve('./backend/data/notes.json');
const resourcesFile = path.resolve('./backend/data/resources.json');

app.use(cors());
app.use(bodyParser.json());

const readJSON = (filePath) => {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    console.error('JSON read error:', err);
    return [];
  }
};

const writeJSON = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('JSON write error:', err);
    return false;
  }
};

app.get('/api/resources', (req, res) => {
  const resources = readJSON(resourcesFile);
  res.json(resources);
});

app.get('/api/notes', (req, res) => {
  const notes = readJSON(notesFile);
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const data = readJSON(notesFile);
  const newNote = {
    id: Date.now().toString(),
    title: req.body.title || 'Untitled',
    content: req.body.content || '',
    tags: Array.isArray(req.body.tags) ? req.body.tags : [],
    createdAt: new Date().toISOString(),
  };
  data.unshift(newNote);
  if (!writeJSON(notesFile, data)) {
    return res.status(500).json({ error: 'Failed to save note' });
  }
  res.status(201).json(newNote);
});

app.put('/api/notes/:id', (req, res) => {
  const notes = readJSON(notesFile);
  const idx = notes.findIndex((n) => n.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Note not found' });

  const updated = {
    ...notes[idx],
    title: req.body.title || notes[idx].title,
    content: req.body.content ?? notes[idx].content,
    tags: Array.isArray(req.body.tags) ? req.body.tags : notes[idx].tags,
    updatedAt: new Date().toISOString(),
  };

  notes[idx] = updated;
  if (!writeJSON(notesFile, notes)) {
    return res.status(500).json({ error: 'Failed to update note' });
  }
  res.json(updated);
});

app.delete('/api/notes/:id', (req, res) => {
  const notes = readJSON(notesFile);
  const newNotes = notes.filter((n) => n.id !== req.params.id);
  if (newNotes.length === notes.length) return res.status(404).json({ error: 'Note not found' });

  if (!writeJSON(notesFile, newNotes)) {
    return res.status(500).json({ error: 'Failed to delete note' });
  }
  res.status(204).end();
});

app.listen(PORT, '0.0.0.0', () => console.log(`Backend API running: http://0.0.0.0:${PORT}`));
