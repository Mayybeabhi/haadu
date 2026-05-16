import Card from '../ui/Card'

export default function RoomSettingsCard({ room }) {
  if (!room) return null

  return (
    <Card>
      <div className="section-title">⚙️ room settings</div>
      <div className="grid-auto" style={{ marginTop: 16 }}>
        <Setting label="Max players" value={room.maxPlayers} />
        <Setting label="Song count" value={room.songCount} />
      </div>
    </Card>
  )
}

function Setting({ label, value }) {
  return (
    <div
      style={{
        border: '2px dashed #ddd',
        borderRadius: 14,
        padding: 16,
        background: 'var(--paper)',
      }}
    >
      <div className="helper-text">{label}</div>
      <div style={{ fontWeight: 900, fontSize: '1.3rem', marginTop: 6 }}>
        {value}
      </div>
    </div>
  )
}