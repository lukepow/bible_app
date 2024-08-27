import express from "express";
import path from "path";
import cors from "cors";
import { WebSocketServer } from 'ws';
import http from 'http';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { getBibleVersions } from './controllers/bible-api-controller.js';
import bookRouter from "./routes/books.js";
import chapterRouter from "./routes/chapters.js";
import verseRouter from "./routes/verses.js";
import verseSelectedRouter from "./routes/verse-selected.js";
import streamRouter from "./routes/stream.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app); // Create HTTP server

const PORT = process.env.MAIN_PORT || 4000; // Fallback port

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'client', 'public')));

// Routes
app.use('/books', bookRouter);
app.use('/chapters', chapterRouter);
app.use('/verses', verseRouter);
app.use('/verse-selected', verseSelectedRouter);
app.use('/stream', streamRouter);

app.get('/', async (req, res) => {
  const bibleVersions = await getBibleVersions();
  res.json(bibleVersions);
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
