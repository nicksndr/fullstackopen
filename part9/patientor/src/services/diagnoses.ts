import diagnosesData from '../../../backend/data/diagnoses.ts';

const getEntries = () => {
  return diagnosesData;
};

const addDiagnosis = () => {
  return null;
};

const getDiagnosis = (code: string) => {
  return diagnosesData.find((d) => d.code === code);
};

export default {
  getEntries,
  addDiagnosis,
  getDiagnosis
};