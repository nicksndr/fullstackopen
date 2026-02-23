import { Patient, NewPatientData, Entry } from '../../types';
import patientsData from '../../data/patients';
import { randomUUID } from 'crypto';

const patients: Patient[] = patientsData;

const getPatients = (): Patient[] => {
    return patients;
};

const addPatient = (entry: NewPatientData): Patient => {
    const newPatientEntry: Patient = {
        id: randomUUID(),
        ...entry
    };

    patients.push(newPatientEntry);
    return newPatientEntry;
};

const addPatientEntry = (id: string, entry: Entry): Patient => {
    const patient = patients.find((p) => p.id === id);
    if (!patient) {
        throw new Error('Patient not found');
    }
    patient.entries.push(entry);
    return patient;
};

export default {
    getPatients,
    addPatient,
    addPatientEntry
};