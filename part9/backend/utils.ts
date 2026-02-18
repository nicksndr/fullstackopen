import { NewPatientData, Gender } from './types';
import { z } from "zod";

// Old manual validation approach (commented out)
// const isString = (text: unknown): text is string => {
//     return typeof text === 'string' || text instanceof String;
// };

// const parseString = (text: unknown): string => {
//     if (!text || typeof text !== 'string') {
//         throw new Error('Incorrect or missing text');
//     }
//     return text;
// };

// const isGender = (param: string): param is Gender => {
//     return Object.values(Gender).includes(param as Gender);
// };

// const parseGender = (gender: unknown): Gender => {
//     if (!gender || !isString(gender) || !isGender(gender)) {
//         throw new Error('Incorrect or missing gender: ' + gender);
//     }
//     return gender;
// };

// Zod schema for NewPatientData validation (entries validated as array of objects; for new patients typically empty)
const NewPatientDataSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    occupation: z.string().min(1, 'Occupation is required'),
    gender: z.enum(Gender),
    dateOfBirth: z.string().optional(),
    entries: z.array(z.record(z.string(), z.unknown())).default([]),
});

const toNewPatientEntry = (object: unknown): NewPatientData => {
    // Old manual validation approach (commented out)
    // if (!object || typeof object !== 'object') {
    //     throw new Error('Incorrect or missing data');
    // }
    //
    // if ('name' in object && 'occupation' in object && 'gender' in object) {
    //     const newEntry: NewPatientData = {
    //         name: parseString(object.name),
    //         occupation: parseString(object.occupation),
    //         gender: parseGender(object.gender),
    //         ...('dateOfBirth' in object && object.dateOfBirth !== undefined && { dateOfBirth: parseString(object.dateOfBirth) }),
    //     };
    //     return newEntry;
    // };
    // throw new Error('Incorrect data: some fields are missing');

    // New Zod validation approach (entries accepted as object[]; cast to NewPatientData for type compatibility)
    return NewPatientDataSchema.parse(object) as unknown as NewPatientData;
};

export default toNewPatientEntry;