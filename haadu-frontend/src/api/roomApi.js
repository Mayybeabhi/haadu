import api from './client'

export const createRoom = (adminUserId) =>
  api.post('/api/rooms', { adminUserId })

export const joinRoom = (roomCode, userId) =>
  api.post(`/api/rooms/${roomCode}/join`, { userId })
