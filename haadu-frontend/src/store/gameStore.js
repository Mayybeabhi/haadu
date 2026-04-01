const STORAGE_KEY = 'haadu_state'

const defaultState = {
  user: null,
  room: null,
  isAdmin: false,
  players: [],
  scoringMode: 'GUESSER',
}

export function getGameState() {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : defaultState
}

export function setGameState(partial) {
  const current = getGameState()
  const next = { ...current, ...partial }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}

export function clearGameState() {
  localStorage.removeItem(STORAGE_KEY)
}