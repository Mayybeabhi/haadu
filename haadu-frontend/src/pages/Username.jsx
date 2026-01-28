import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createGuestUser } from '../api/userApi'

function Username() {
  const [username, setUsername] = useState('')
  const navigate = useNavigate()

  const handleContinue = async () => {
    if (!username.trim()) return alert('Enter username')

    const res = await createGuestUser(username)
    localStorage.setItem('userId', res.data.id)
    localStorage.setItem('username', username)

    navigate('/room-select')
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

      <button onClick={handleContinue}>
        Continue
      </button>
    </div>
  )
}

export default Username
