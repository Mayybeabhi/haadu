import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

export function createRoomSocket(roomCode, onEvent) {
  const client = new Client({
    webSocketFactory: () => new SockJS('/ws'),
    reconnectDelay: 3000,
    onConnect: () => {
      console.log('Connected to room socket')

      client.subscribe(`/topic/rooms/${roomCode}`, (message) => {
        const event = JSON.parse(message.body)
        console.log('SOCKET EVENT:', event)
        onEvent?.(event)
      })
    },
  })

  client.activate()
  return client
}