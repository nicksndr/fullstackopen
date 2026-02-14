import axios from 'axios'
import type { NonSensitiveDiaryEntry, NewDiaryEntry, DiaryEntry } from '../../types'
const baseUrl = '/api/diaries'

const getAll = async (): Promise<NonSensitiveDiaryEntry[]> => {
  const { data } = await axios.get<NonSensitiveDiaryEntry[]>(
    `${baseUrl}`
  );

  return data;
};

const create = async (newObject: NewDiaryEntry): Promise<DiaryEntry> => {
  const { data } = await axios.post<DiaryEntry>(baseUrl, newObject);
  return data;
}

// const update = (id, newObject) => {
//   const request = axios.put(`${baseUrl}/${id}`, newObject)
//   return request.then(response => response.data)
// }

// const createComment = (id, commentObject) => {
//   const request = axios.post(`${baseUrl}/${id}/comments`, commentObject)
//   return request.then(response => response.data)
// }

// const remove = (id, token) => {
//   return axios.delete(`${baseUrl}/${id}`,{
//     headers: { authorization: `Bearer ${token}` }
//   })
// }

export default { getAll, create } //create, createComment,update, remove