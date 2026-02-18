import express from 'express';
import diagnosesData from '../../data/diagnoses';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(diagnosesData);
});

router.get('/:code', (req, res) => {
  const diagnosis = diagnosesData.find((d) => d.code === req.params.code);
  if (!diagnosis) {
    res.sendStatus(404);
    return;
  }
  res.send(diagnosis);
});

export default router;