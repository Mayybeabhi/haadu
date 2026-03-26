import { useState } from "react"
import { useParams } from "react-router-dom"
import { submitSong } from "../api/songApi"

function SongSubmit() {
  const { roomCode } = useParams()
  const [url, setUrl] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const userId = localStorage.getItem("userId")

  const handleSubmit = async () => {
    if (!url.trim()) return alert("Enter YouTube URL")
    await submitSong(roomCode, userId, url)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div>
        <h2>Song Submitted ✅</h2>
        <p>Waiting for other players...</p>
      </div>
    )
  }

  return (
    <div>
      <h2>Submit your song</h2>
      <input
        placeholder="Paste the YouTube url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit song</button>
    </div>
  )
}

export default SongSubmit