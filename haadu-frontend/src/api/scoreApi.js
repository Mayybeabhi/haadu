import client from './client'

export async function getScores(roomCode, mode) {
  const res = await client.get(`/rooms/${roomCode}/scores?mode=${mode}`)
  return res.data
}