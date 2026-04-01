import client from "./client";

export async function CreateRoom(adminUserId){
   const res= await client.post('/rooms',{adminUserId})
   return res.data
}