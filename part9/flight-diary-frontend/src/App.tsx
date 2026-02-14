import { useState, useEffect } from "react";
import type { NonSensitiveDiaryEntry, Visibility, Weather } from '../types.ts'
import diaryService from "./services/diaries.ts";

const DiaryForm = ({ newDate: string, newVisibility: Visibility, newWeather: Weather, newComment: string, handleDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void, handleVisibilityChange: (e: React.ChangeEvent<HTMLInputElement>) => void, handleWeatherChange: (e: React.ChangeEvent<HTMLInputElement>) => void, handleCommentChange: (e: React.ChangeEvent<HTMLInputElement>) => void, addDiary: (e: React.SyntheticEvent<HTMLFormElement>) => void }) => {
  return (
    <form onSubmit={addDiary}>
      <div>
        Date: <input value={newDate} onChange={handleDateChange} />
      </div>
      <div>
        Visibility: <input value={newVisibility} onChange={handleVisibilityChange} />
      </div>
      <div>
        Weather: <input value={newWeather} onChange={handleWeatherChange} />
      </div>
      <div>
        Comment: <input value={newComment} onChange={handleCommentChange} />
      </div>
      <div>
        <button type="submit">Add</button>
      </div>
    </form>
  )
}



function App() {
  const [diaries, setDiaries] = useState<NonSensitiveDiaryEntry[]>([]);
  const [newDate, setNewDate] = useState('');
  const [newVisibility, setNewVisibility] = useState('');
  const [newWeather, setNewWeather] = useState('');
  const [newComment, setNewComment] = useState('');

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

  const addDiary = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    diaryService.create({ date: newDate, visibility: newVisibility as Visibility, weather: newWeather as Weather, comment: newComment })
      .then((newDiary: NonSensitiveDiaryEntry) => {
        setDiaries(diaries.concat(newDiary));
        setNewDate('');
        setNewVisibility('');
        setNewWeather('');
        setNewComment('');
      })
      .catch((error) => {
        console.error('Error adding diary:', error);
      });
  }

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
      <h2>Add new entry</h2>
        <DiaryForm 
        newDate={newDate} 
        newVisibility={newVisibility} 
        newWeather={newWeather} 
        newComment={newComment} 
        handleDateChange={(e) => setNewDate(e.target.value)} 
        handleVisibilityChange={(e) => setNewVisibility(e.target.value)} 
        handleWeatherChange={(e) => setNewWeather(e.target.value)} 
        handleCommentChange={(e) => setNewComment(e.target.value)} 
        addDiary={addDiary} />
      <h2>Diary Entries</h2>
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
