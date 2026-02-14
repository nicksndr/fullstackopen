import { useState, useEffect } from "react";
import type { NonSensitiveDiaryEntry } from '../types.ts'
import diaryService from "./services/diaries.ts";

function App() {
  const [diaries, setDiaries] = useState<NonSensitiveDiaryEntry[]>([]);

  useEffect(() => {
    diaryService.getAll()
      .then((diaries: NonSensitiveDiaryEntry[]) => {
        if (Array.isArray(diaries)) {
          setDiaries(diaries);
        } else {
          console.error('Expected array but got:', diaries);
          setDiaries([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching diaries:', error);
        setDiaries([]);
      });
  }, []);

//   const fetchDiaries = async () => {
//     try {
//       const fetchedDiaries = await diaryService.getAll();
//       setDiaries(fetchedDiaries);
//     } catch (error) {
//       console.error('Error fetching diaries:', error);
//       setDiaries([]);
//     }
//   };
//   void fetchDiaries();
// }, []);

  return (
    <div>
      <h1>Diary Entries</h1>
      <ul>
        {diaries.map((diary: NonSensitiveDiaryEntry) => (
          <div>
            <h3>{diary.date}</h3>
            <li>{diary.weather}</li>
            <li>{diary.visibility}</li>
          </div>
        ))}
      </ul>
    </div>
  )
}

export default App
