import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = (newObject, token) => {
  const request = axios.post(baseUrl, newObject, {
    headers: { authorization: `Bearer ${token}` }
  })
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

const remove = (id, token) => {
  return axios.delete(`${baseUrl}/${id}`,{
    headers: { authorization: `Bearer ${token}` }
  })
}

export default { getAll, create, update, remove }