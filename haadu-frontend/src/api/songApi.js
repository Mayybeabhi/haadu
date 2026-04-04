import client from './client'

export async function submitSong(roomCode, payload) {
  const res = await client.post(`/rooms/${roomCode}/songs`, payload)
  return res.data
}

export async function getSongById(roomCode, songId) {
  const res = await client.get(`/rooms/${roomCode}/songs/${songId}`)
  return res.data
}