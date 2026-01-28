import express from 'express';
import patientsData from '../../data/patients';
import patientService from '../services/patientService';
import { SensitivePatientData } from '../../types';
import toNewPatientEntry from '../../utils';

const router = express.Router();

router.get('/', (_req, res) => {
    const patientsWithoutSsn: SensitivePatientData[] = patientsData.map(({ ssn, ...patient }) => patient);
    res.send(patientsWithoutSsn);
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

