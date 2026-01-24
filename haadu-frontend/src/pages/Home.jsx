import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
  const [username, setUsername] = useState('')
  const navigate = useNavigate()

  const createRoom = async () => {
    // TEMP: hardcode until API is wired
    navigate('/rooms/0F79D')
  }

  return (
    <div>
      <h1>🎵 Haadu</h1>

      <input
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <br /><br />

      <button onClick={createRoom}>Create Room</button>
    </div>
  )
}

export default Home
