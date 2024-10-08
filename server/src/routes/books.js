import express from 'express';
import { getBooks } from '../controllers/bible-api-controller.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { version, abbr } = req.query;
  const bookList = await getBooks(version);

  res.json({
    version: version,
    abbr: abbr,
    list: bookList
  });
});

export default router;
