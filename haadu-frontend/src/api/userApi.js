import api from './client'

export const createGuestUser = (username) =>
  api.post('/api/users/guest', { username })
