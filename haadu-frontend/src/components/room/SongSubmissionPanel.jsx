import { useEffect, useState } from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'

import {
  submitSong,
  getRoomSongs,
  updateSong,
} from '../../api/songApi'

export default function SongSubmissionPanel({
  roomCode,
  songCount = 1,
  onSubmitted,
}) {

  const [songs, setSongs] = useState(
    () => Array(songCount).fill('')
  )

  const [statuses, setStatuses] = useState(
    () => Array(songCount).fill(null)
  )

  const [submittedUrls, setSubmittedUrls] = useState(
    () => Array(songCount).fill(null)
  )

  const [songIds, setSongIds] = useState(
    () => Array(songCount).fill(null)
  )

  const [loadingIndex, setLoadingIndex] = useState(null)

  const [fetchError, setFetchError] = useState('')

  const loadExisting = async () => {

    if (!roomCode) return

    try {

      const existing = await getRoomSongs(roomCode)

      const urls = Array(songCount).fill('')
      const newStatuses = Array(songCount).fill(null)
      const newSubmittedUrls = Array(songCount).fill(null)
      const newSongIds = Array(songCount).fill(null)

      existing.forEach((song, i) => {

        if (i < songCount) {

          urls[i] = song.youtubeUrl ?? ''

          newStatuses[i] = 'success'

          newSubmittedUrls[i] =
            song.youtubeUrl ?? ''

          newSongIds[i] = song.id
        }
      })

      setSongs(urls)

      setStatuses(newStatuses)

      setSubmittedUrls(newSubmittedUrls)

      setSongIds(newSongIds)

    } catch (e) {

      setSongs(Array(songCount).fill(''))

      setStatuses(Array(songCount).fill(null))

      setSubmittedUrls(Array(songCount).fill(null))

      setSongIds(Array(songCount).fill(null))

      setFetchError('')
    }
  }

  useEffect(() => {
    loadExisting()
  }, [roomCode, songCount])

  const updateSongInput = (index, value) => {

    if (statuses[index] === 'success') return

    const next = [...songs]

    next[index] = value

    setSongs(next)

    if (statuses[index] === 'error') {

      const nextStatuses = [...statuses]

      nextStatuses[index] = null

      setStatuses(nextStatuses)
    }
  }

  const handleEdit = (index) => {

    const nextStatuses = [...statuses]

    nextStatuses[index] = null

    setStatuses(nextStatuses)
  }

  const handleSubmitOne = async (index) => {

    const url = songs[index]?.trim()

    if (!url) return

    setLoadingIndex(index)

    const nextStatuses = [...statuses]

    try {

      if (songIds[index]) {

        await updateSong(
          roomCode,
          songIds[index],
          url
        )

      } else {

        await submitSong(
          roomCode,
          url
        )
      }

      nextStatuses[index] = 'success'

      const nextSubmittedUrls = [...submittedUrls]

      nextSubmittedUrls[index] = url

      setSubmittedUrls(nextSubmittedUrls)

      await loadExisting()

      onSubmitted?.()

    } catch (e) {

      nextStatuses[index] = 'error'

      console.error(
        'Submit error:',
        e?.response?.data || e.message
      )

    } finally {

      setStatuses([...nextStatuses])

      setLoadingIndex(null)
    }
  }

  const isSubmitted = (index) =>
    statuses[index] === 'success'

  const isSameAsSubmitted = (index) =>
    songs[index]?.trim() === submittedUrls[index]

  const isBusy = loadingIndex !== null

  return (
    <Card>

      <div className="section-title">
        🎶 submit songs
      </div>

      {fetchError && (
        <div className="error-text">
          {fetchError}
        </div>
      )}

      <div
        className="stack"
        style={{ marginTop: 16 }}
      >

        {songs.map((song, i) => (

          <div
            key={i}
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'center',
            }}
          >

            <div style={{ flex: 1 }}>

              <Input
                placeholder={`Paste song URL ${i + 1}`}

                value={song}

                onChange={(e) =>
                  updateSongInput(
                    i,
                    e.target.value
                  )
                }

                disabled={
                  isSubmitted(i) || isBusy
                }

                style={{
                  borderColor:
                    statuses[i] === 'success'
                      ? '#4caf82'
                      : statuses[i] === 'error'
                      ? '#e8453c'
                      : undefined,

                  opacity:
                    isSubmitted(i) ? 0.6 : 1,

                  cursor:
                    isSubmitted(i)
                      ? 'not-allowed'
                      : 'text',
                }}
              />
            </div>

            {isSubmitted(i) ? (

              <Button
                color="yellow"

                onClick={() =>
                  handleEdit(i)
                }

                disabled={isBusy}

                style={{
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                ✏️ edit
              </Button>

            ) : (

              <Button
                color={
                  statuses[i] === 'error'
                    ? 'red'
                    : 'green'
                }

                onClick={() =>
                  handleSubmitOne(i)
                }

                disabled={
                  !songs[i]?.trim() ||
                  loadingIndex === i ||
                  isBusy ||
                  isSameAsSubmitted(i)
                }

                style={{
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >

                {loadingIndex === i
                  ? '...'
                  : statuses[i] === 'error'
                  ? '✗ retry'
                  : 'submit'}

              </Button>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}