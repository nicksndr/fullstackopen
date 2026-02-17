import express from 'express';

import router from './routes/diagnoses.ts';
const app = express();
app.use(express.json());

const PORT = 3003;

app.get('/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});


app.use('/api/diagnoses', router);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});