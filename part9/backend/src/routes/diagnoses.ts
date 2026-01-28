import express from 'express';
import diagnosesData from '../../data/diagnoses.ts';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send('Fetching all diagnoses!');
});

router.get('/api/diagnoses', (_req, res) => {
  res.send(diagnosesData);
});

router.post('/', (_req, res) => {
  res.send('Saving a diagnosis!');
});

export default router;