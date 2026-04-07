import Card from '../ui/Card'

function getYoutubeEmbedUrl(url) {
  if (!url) return null

  try {
    const u = new URL(url)
    const v = u.searchParams.get('v')
    if (v) return `https://www.youtube.com/embed/${v}?autoplay=1`
    if (u.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}?autoplay=1`
    }
  } catch {
    return null
  }

  return null
}

export default function YoutubePlayer({ url }) {
  const embedUrl = getYoutubeEmbedUrl(url)

  return (
    <Card>
      <div className="section-title" style={{ textAlign: 'center' }}>
        🤔 whose song is this?
      </div>

      <div style={{ marginTop: 16 }}>
        {embedUrl ? (
          <div
            style={{
              position: 'relative',
              paddingBottom: '56.25%',
              height: 0,
              overflow: 'hidden',
              borderRadius: 12,
              border: '2px solid var(--ink)',
            }}
          >
            <iframe
              src={embedUrl}
              title="Song"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
              allowFullScreen
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
              }}
            />
          </div>
        ) : (
          <div
            style={{
              padding: 28,
              textAlign: 'center',
              border: '2px dashed #ddd',
              borderRadius: 12,
              background: 'var(--paper)',
              fontWeight: 800,
            }}
          >
            🎵 Song loaded (video unavailable)
          </div>
        )}
      </div>
    </Card>
  )
}