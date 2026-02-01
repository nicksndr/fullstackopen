import { NewPatientData } from './types';

// To Do add parsing for different types

const parseString = (text: unknown): string => {
    if (!text || typeof text !== 'string') {
        throw new Error('Incorrect or missing text');
    }
    return text;
};

const toNewPatientEntry = (object: unknown): NewPatientData => {
    if (!object || typeof object !== 'object') {
        throw new Error('Incorrect or missing data');
    }

    if ('name' in object && 'occupation' in object && 'gender' in object) {
        const newEntry: NewPatientData = {
            name: parseString(object.name),
            occupation: parseString(object.occupation),
            gender: parseString(object.gender),
            ...('dateOfBirth' in object && object.dateOfBirth !== undefined && { dateOfBirth: parseString(object.dateOfBirth) }),
        };
        return newEntry;
    };
    throw new Error('Incorrect data: some fields are missing');
};

export default toNewPatientEntry;