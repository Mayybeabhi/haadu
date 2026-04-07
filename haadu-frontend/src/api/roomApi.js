import client from "./client";

export async function createRoom(adminUserId){
   const res= await client.post('/rooms',{adminUserId})
   return res.data
}

export async function updateRoomSettings(roomCode,settings){
    const res=await client.post(`/rooms/${roomCode}/settings`, settings)
    return res.data
}

export async function joinRoom(roomCode,userId){
    const res=await client.post(`/rooms/${roomCode}/join`,{userId})
    return res.data
}

export async function getRoomPlayers(roomCode) {
  const res = await client.get(`/rooms/${roomCode}/players`)
  return res.data
}

export async function getRoomDetails(roomCode) {
  const res = await client.get(`/rooms/${roomCode}`)
  return res.data
}

export async function getRoomState(roomCode) {
  const res = await client.get(`/rooms/${roomCode}/state`)
  return res.data
}