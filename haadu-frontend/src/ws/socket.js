import SockJS from "sockjs-client"
import Stomp from "stompjs"

export const connectToRoom = (roomCode, onMessage) => {
  const socket = new SockJS("http://localhost:8080/ws")
  const stompClient = Stomp.over(socket)

  stompClient.connect({}, () => {
    stompClient.subscribe(`/topic/rooms/${roomCode}`, (message) => {
      const event = JSON.parse(message.body)
      onMessage(event)
    })
  })

  return stompClient
}