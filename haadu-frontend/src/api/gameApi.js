import client from './client'

export async function startGame(roomCode) {
  const res = await client.post(`/rooms/${roomCode}/start`)
  return res.data
}

export async function startRound(roomCode) {
  const res = await client.post(`/rooms/${roomCode}/rounds/start`)
  return res.data
}

export async function submitGuess(roomCode, roundId, payload) {
  const res = await client.post(`/rooms/${roomCode}/rounds/${roundId}/guess`, payload)
  return res.data
}

export async function endRound(roomCode, roundId) {
  const res = await client.post(`/rooms/${roomCode}/rounds/${roundId}/end`)
  return res.data
}

export async function endGame(roomCode) {
  const res = await client.post(`/rooms/${roomCode}/end`)
  return res.data
}