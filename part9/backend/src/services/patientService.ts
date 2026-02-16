import { Patient, NewPatientData } from '../../types';
import patientsData from '../../data/patients';
import { randomUUID } from 'crypto';

const patients: Patient[] = patientsData as Patient[];

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

export default {
    getPatients,
    addPatient
};