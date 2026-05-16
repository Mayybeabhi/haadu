import axios from 'axios'
import { getGameState } from '../store/gameStore'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

client.interceptors.request.use((config) => {

  const { token } = getGameState()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default client