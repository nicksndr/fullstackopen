import { useState, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  useParams,
} from "react-router-dom";
import { Button, Divider, Container, Typography } from "@mui/material";

import { apiBaseUrl } from "./constants";
import { Patient, Entry } from "./types";

import patientService from "./services/patients";
import PatientListPage from "./components/PatientListPage";
import diagnosisService from "./services/diagnoses";

const assertNever = (value: never): never => {
  throw new Error(`Unhandled member: ${JSON.stringify(value)}`);
};

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  switch (entry.type) {
    case "Hospital":
      return (
        <div>
          <p>
            discharge: {entry.discharge.date} - {entry.discharge.criteria}
          </p>
        </div>
      );
    case "OccupationalHealthcare":
      return (
        <div>
          <p>employer: {entry.employerName}</p>
          <p>
            sick leave: {entry.sickLeave?.startDate} -{" "}
            {entry.sickLeave?.endDate}
          </p>
        </div>
      );
    case "HealthCheck":
      return (
        <div>
          <p>health check rating: {entry.healthCheckRating}</p>
        </div>
      );
    default:
      return assertNever(entry as never);
  }
};

const PatientDetailPlaceholder = ({ patients }: { patients: Patient[] }) => {
  const { id } = useParams<{ id: string }>();
  const patient = patients.find((patient) => patient.id === id);

  return (
    <div>
      <h2>{patient?.name}</h2>
      <p>occupation: {patient?.occupation}</p>
      <p>date of birth: {patient?.dateOfBirth}</p>
      <br></br>
      <h3>Entries</h3>
      {patient?.entries.map((entry) => (
        <div key={entry.id}>
          <p>{entry.date}</p>
          <p>{entry.description}</p>
          <ul>
            {entry.diagnosisCodes?.map((code) => (
              <li key={code}>
                {code}
                {" " + diagnosisService.getDiagnosis(code)?.name}
              </li>
            ))}
          </ul>
          <EntryDetails entry={entry} />
        </div>
      ))}
    </div>
  );
};

const App = () => {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      const patients = await patientService.getAll();
      setPatients(patients);
    };
    void fetchPatientList();
  }, []);

  return (
    <div className="App">
      <Router>
        <Container>
          <Typography variant="h3" style={{ marginBottom: "0.5em" }}>
            Patientor
          </Typography>
          <Button component={Link} to="/" variant="contained" color="primary">
            Home
          </Button>
          <Divider hidden />
          <Routes>
            <Route
              path="/"
              element={
                <PatientListPage
                  patients={patients}
                  setPatients={setPatients}
                />
              }
            />
            <Route
              path="/patients/:id"
              element={<PatientDetailPlaceholder patients={patients} />}
            />
          </Routes>
        </Container>
      </Router>
    </div>
  );
};

export default App;
