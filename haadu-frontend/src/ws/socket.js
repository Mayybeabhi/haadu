import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

let stompClient = null

export const connectToRoom = (roomCode, onMessage) => {
  const socket = new sockJS('http://localhost:8080/ws')
  stompClient = Stomp.over(socket)

  stompClient.connect({}, () => {
    stompClient.subscribe('/topic/rooms/${roomCode}', (msg) => {
      onMessage(JSON.parse(msg.body))
    })
  })
}



