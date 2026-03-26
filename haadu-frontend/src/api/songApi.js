import api from './client'

export const submitSong = (roomCode, userId, url) =>
api.post(`/api/rooms/${roomCode}/songs`,{userId,url})