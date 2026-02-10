import { useState, useEffect } from "react";
import type { DiaryEntry } from '../types.ts'
import diaryService from "./services/diaries.ts";

function App() {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    diaryService.getAll().then((diaries: DiaryEntry[]) => setDiaries(diaries));
  }, []);

  return (
    <div>
      <h1>Diary Entries</h1>
      <ul>
        {diaries.map((diary) => (
          <div>
          <h3 key={diary.id}>{diary.date}</h3>
          <li key={diary.id}>{diary.weather}</li>
          <li key={diary.id}>{diary.visibility}</li>
          </div>
        ))}
      </ul>
    </div>
  )
}

export default App
