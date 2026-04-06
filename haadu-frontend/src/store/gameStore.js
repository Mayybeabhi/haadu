const STORAGE_KEY = 'haadu_state'

const defaultState = {
  user: null,
  room: null,
  isAdmin: false,
  players: [],
  scoringMode: 'GUESSER',
}

export function getGameState() {
  const raw = sessionStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : defaultState
}

export function setGameState(partial) {
  const current = getGameState()
  const next = { ...current, ...partial }
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}

export function clearGameState() {
  sessionStorage.removeItem(STORAGE_KEY)
}