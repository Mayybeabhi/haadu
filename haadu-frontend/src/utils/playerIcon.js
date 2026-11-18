const PLAYER_ICONS = [
  '01-vinyl.png',
  '02-cassette.png',
  '03-headphones.png',
  '04-equalizer.png',
  '05-music-note.png',
  '06-electric-guitar.png',
  '07-acoustic-guitar.png',
  '08-drum.png',
  '09-microphone.png',
  '10-speaker.png',
  '11-turntable.png',
  '12-waveform.png',
  '13-treble-clef.png',
  '14-bass-clef.png',
  '15-music-waves.png',
  '16-mixer.png',
  '17-piano-keys.png',
  '18-trumpet.png',
  '19-synthesizer.png',
  '20-disco-ball.png',
]

const ICON_BASE = '/images/player-icons/'

// Hash username to a starting icon
function hashUsername(username) {
  let hash = 0

  for (let i = 0; i < username.length; i++) {
    hash = (hash * 31 + username.charCodeAt(i)) >>> 0
  }

  return hash % PLAYER_ICONS.length
}

// Assign unique icons to all players in a room
export function getPlayerIcons(players) {
  const assignments = {}
  const usedIcons = new Set()

  // Sort so assignments don't depend on player list order
  const sortedPlayers = [...players].sort((a, b) =>
    String(a.username).localeCompare(String(b.username))
  )

  sortedPlayers.forEach((player) => {
    const username = player.username
    let iconIndex = hashUsername(username)

    // Find the next available icon if there's a collision
    while (usedIcons.has(iconIndex)) {
      iconIndex = (iconIndex + 1) % PLAYER_ICONS.length
    }

    usedIcons.add(iconIndex)
    assignments[username] = `${ICON_BASE}${PLAYER_ICONS[iconIndex]}`
  })

  return assignments
}