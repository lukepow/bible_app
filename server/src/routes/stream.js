import express from "express";
import bodyParser from 'body-parser';
import { getChatStream } from '../controllers/llm-api-controller.js';
import { bookIds } from '../utils/helpers.js';

const router = express();
router.use(bodyParser.json());
let sessionData = {};

router.post('/init', async (req, res) => {
  const { original, translated, chapter } = req.body;
  const [abbr, chapterNum] = chapter.split('.');
  const book = bookIds[abbr];
  sessionData['originalPassage'] = original;
  sessionData['translatedPassage'] = translated;
  sessionData['reference'] = `${book} chapter ${chapterNum}`;
  res.json({ message: 'Initialization successful' });
})

router.get('/', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

   try {
        const { stream, onData } = getChatStream({
          serviceName: "groq",
        });

        const streamResponse = await stream(
          sessionData.reference,
          sessionData.translatedPassage,
          sessionData.originalPassage,
        )

        for await (const chunk of streamResponse) {
          const data = { message: onData(chunk) };

          res.write(`data: ${JSON.stringify(data)}\n\n`);
        }

        req.on('close', () => {
          res.end();
        });
    } catch (error) {
        console.error('Request error:', error);
        res.write('data: [ERROR]\n\n');
        res.end();
    }
});

export default router;
