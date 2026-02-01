import { NewPatientData, Gender } from './types';

const isString = (text: unknown): text is string => {
    return typeof text === 'string' || text instanceof String;
};

const isGender = (param: string): param is Gender => {
    return Object.values(Gender).includes(param as Gender);
};

const parseGender = (gender: unknown): Gender => {
    if (!gender || !isString(gender) || !isGender(gender)) {
        throw new Error('Incorrect or missing gender: ' + gender);
    }
    return gender;
};

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
            gender: parseGender(object.gender),
            ...('dateOfBirth' in object && object.dateOfBirth !== undefined && { dateOfBirth: parseString(object.dateOfBirth) }),
        };
        return newEntry;
    };
    throw new Error('Incorrect data: some fields are missing');
};

export default toNewPatientEntry;