import { useState, useEffect } from "react";
import type { NonSensitiveDiaryEntry, NewDiaryEntry, DiaryEntry } from '../types.ts'
import diaryService from "./services/diaries.ts";
import axios from "axios";
import './App.css';

const ErrorMessage = ({ message }: { message: string | null }) => {
  if (message === null) return null;

  return (
    <div className="error">
      {message}
    </div>  
  );
};

interface DiaryFormProps {
  newDate: string;
  newVisibility: string;
  newWeather: string;
  newComment: string;
  handleDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleVisibilityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleWeatherChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCommentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addDiary: (e: React.SyntheticEvent<HTMLFormElement>) => void;
}

const DiaryForm = ({ 
  newDate, 
  newVisibility, 
  newWeather, 
  newComment, 
  handleDateChange, 
  handleVisibilityChange, 
  handleWeatherChange, 
  handleCommentChange, 
  addDiary 
}: DiaryFormProps) => {
  return (
    <form onSubmit={addDiary}>
      <div>
        Date: <input type="date" value={newDate} onChange={handleDateChange} />
      </div>
      <div>
        Visibility: 
        <input type="radio" id="visibility-great" name="visibility" value="great" checked={newVisibility === 'great'} onChange={handleVisibilityChange} />
        <label htmlFor="visibility-great">Great</label>
        <input type="radio" id="visibility-good" name="visibility" value="good" checked={newVisibility === 'good'} onChange={handleVisibilityChange} />
        <label htmlFor="visibility-good">Good</label>
        <input type="radio" id="visibility-ok" name="visibility" value="ok" checked={newVisibility === 'ok'} onChange={handleVisibilityChange} />
        <label htmlFor="visibility-ok">Ok</label>
        <input type="radio" id="visibility-poor" name="visibility" value="poor" checked={newVisibility === 'poor'} onChange={handleVisibilityChange} />
        <label htmlFor="visibility-poor">Poor</label>
      </div>
      <div>
        Weather: 
        <input type="radio" id="weather-sunny" name="weather" value="sunny" checked={newWeather === 'sunny'} onChange={handleWeatherChange} />
        <label htmlFor="weather-sunny">Sunny</label>
        <input type="radio" id="weather-rainy" name="weather" value="rainy" checked={newWeather === 'rainy'} onChange={handleWeatherChange} />
        <label htmlFor="weather-rainy">Rainy</label>
        <input type="radio" id="weather-cloudy" name="weather" value="cloudy" checked={newWeather === 'cloudy'} onChange={handleWeatherChange} />
        <label htmlFor="weather-cloudy">Cloudy</label>
        <input type="radio" id="weather-stormy" name="weather" value="stormy" checked={newWeather === 'stormy'} onChange={handleWeatherChange} />
        <label htmlFor="weather-stormy">Stormy</label>
        <input type="radio" id="weather-windy" name="weather" value="windy" checked={newWeather === 'windy'} onChange={handleWeatherChange} />
        <label htmlFor="weather-windy">Windy</label>
      </div>
      <div>
        Comment: <input value={newComment} onChange={handleCommentChange} />
      </div>
      <div>
        <button type="submit">Add</button>
      </div>
    </form>
  );
};



function App() {
  const [diaries, setDiaries] = useState<NonSensitiveDiaryEntry[]>([]);
  const [newDate, setNewDate] = useState('');
  const [newVisibility, setNewVisibility] = useState('');
  const [newWeather, setNewWeather] = useState('');
  const [newComment, setNewComment] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    const newDiaryEntry: NewDiaryEntry = {
      date: newDate,
      visibility: newVisibility as NonSensitiveDiaryEntry['visibility'],
      weather: newWeather as NonSensitiveDiaryEntry['weather'],
      comment: newComment,
    };
    
    diaryService.create(newDiaryEntry)
      .then((createdDiary: DiaryEntry) => {
        // Convert DiaryEntry to NonSensitiveDiaryEntry for display
        const nonSensitiveEntry: NonSensitiveDiaryEntry = {
          id: createdDiary.id,
          date: createdDiary.date,
          weather: createdDiary.weather,
          visibility: createdDiary.visibility,
        };
        setDiaries(diaries.concat(nonSensitiveEntry));
        setNewDate('');
        setNewVisibility('');
        setNewWeather('');
        setNewComment('');
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          if (error.response?.data && typeof error.response.data === 'string') {
            // Backend sends error message as a string
            const message = error.response.data.replace('Something went wrong. ', '');
            setErrorMessage(message);
          } else {
            setErrorMessage('Unrecognized axios error');
          }
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        } else {
          setErrorMessage('Error adding diary: ' + String(error));
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        }
      });
  };

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
      <ErrorMessage message={errorMessage} />
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
