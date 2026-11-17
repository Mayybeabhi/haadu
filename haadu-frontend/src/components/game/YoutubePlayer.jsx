
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
    <Card className="youtube-card">
      <div className="youtube-prompt">
      
        <span>WHOSE SONG IS THIS?</span>
      </div>

      <div className="youtube-frame">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title="Song"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
            allowFullScreen
          />
        ) : (
          <div className="youtube-unavailable">
            SONG LOADED - VIDEO UNAVAILABLE
          </div>
        )}
      </div>
    </Card>
  )
}
