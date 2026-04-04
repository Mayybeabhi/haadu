import client from './client'

export async function startGame(roomCode, adminUserId) {
  const res = await client.post(`/rooms/${roomCode}/start`, { adminUserId })
  return res.data
}

export async function startRound(roomCode, adminUserId) {
  const res = await client.post(`/rooms/${roomCode}/rounds/start`, { adminUserId })
  return res.data
}

export async function submitGuess(roomCode, roundId, payload) {
  const res = await client.post(`/rooms/${roomCode}/rounds/${roundId}/guess`, payload)
  return res.data
}

export async function endRound(roomCode, roundId, adminUserId) {
  const res = await client.post(`/rooms/${roomCode}/rounds/${roundId}/end`, { adminUserId })
  return res.data
}

export async function endGame(roomCode, adminUserId) {
  const res = await client.post(`/rooms/${roomCode}/end`, { adminUserId })
  return res.data
}