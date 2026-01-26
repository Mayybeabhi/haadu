import api from './client'

export const createGuestUser = (username) =>
  api.post('/api/users/guest', { username })

export const createRoom = (adminUserId) =>
  api.post('/api/rooms', { adminUserId })

export const joinRoon = (roomCode, userId) =>
  api.post('/api/rooms/${roomCode}/join', { userId })
