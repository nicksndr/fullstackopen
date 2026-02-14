import axios from 'axios'
import type { NonSensitiveDiaryEntry } from '../../types'
const baseUrl = '/api/diaries'

const getAll = async (): Promise<NonSensitiveDiaryEntry[]> => {
  const { data } = await axios.get<NonSensitiveDiaryEntry[]>(
    `${baseUrl}`
  );

  return data;
};

// const create = (newObject, token) => {
//   const request = axios.post(baseUrl, newObject, {
//     headers: { authorization: `Bearer ${token}` }
//   })
//   return request.then(response => response.data)
// }

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

export default { getAll } //create, createComment,update, remove