import client from './client'

export async function createGuestUser(username) {
    const res= await client.post('/users/guest',{username})
    return res.data
    
}