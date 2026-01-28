import express from 'express';
import diagnosesData from '../../data/diagnoses';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(diagnosesData);
});

export default router;