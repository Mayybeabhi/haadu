import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

export function createRoomSocket(roomCode, onEvent) {
  const sock = new SockJS('/ws')

  const client = new Client({
    webSocketFactory: () => sock,
    reconnectDelay: 3000,
    onConnect: () => {
      client.subscribe(`/topic/rooms/${roomCode}`, (message) => {
        const event = JSON.parse(message.body)
        onEvent?.(event)
      })
    },
  })

  client.activate()
  return client
}