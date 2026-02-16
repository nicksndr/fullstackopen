import express from 'express';
import patientsData from '../../data/patients';
import patientService from '../services/patientService';
import { NonSensitivePatient, SensitivePatientData } from '../../types';
import toNewPatientEntry from '../../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  // Destructure to exclude ssn; _ssn is intentionally unused 
  const patientsWithoutSsn = patientsData.map(({ ssn: _ssn, ...patient }) => patient) as NonSensitivePatient[];
  res.send(patientsWithoutSsn);
});

router.get('/:id', (req, res) => {
  const patient = patientsData.find((p) => p.id === req.params.id);
  if (!patient) {
    res.sendStatus(404);
    return;
  }
  // Destructure to exclude ssn from response (_ssn intentionally unused)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- ssn omitted on purpose
  const { ssn: _ssn, ...patientWithoutSsn } = patient;
  res.json(patientWithoutSsn as SensitivePatientData);
});

router.post('/', (req, res) => {
    try {
      const newPatientEntry = toNewPatientEntry(req.body);
  
      const addedEntry = patientService.addPatient(newPatientEntry);
      res.json(addedEntry);
    } catch (error: unknown) {
      let errorMessage = 'Something went wrong.';
      if (error instanceof Error) {
        errorMessage += ' Error: ' + error.message;
      }
      res.status(400).send(errorMessage);
    }
  });

export default router;

