import client from './client'

export async function submitSong(roomCode, youtubeUrl) {
  const res = await client.post(`/rooms/${roomCode}/songs`, {youtubeUrl})
  return res.data
}

export async function getRoomSongs(roomCode) {
  const res = await client.get(`/rooms/${roomCode}/songs`)
  return res.data
}

export async function getSongById(roomCode, songId) {
  const res = await client.get(`/rooms/${roomCode}/songs/${songId}`)
  return res.data
}

export async function updateSong(roomCode,songId,youtubeUrl) {

  const res = await client.put(`/rooms/${roomCode}/songs/${songId}`,{youtubeUrl})

  return res.data
}