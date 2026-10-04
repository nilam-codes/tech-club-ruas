const fs = require('fs');
let content = fs.readFileSync('src/pages/Archive/ArchiveDetailPage.jsx', 'utf8');

// Add imports
content = content.replace(\import { getArchiveByEventId } from '../../services/archiveService';\, \import { getArchiveByEventId, isVideoFile } from '../../services/archiveService';
import MediaLightbox from '../../components/common/MediaLightbox/MediaLightbox';
import { Play } from 'lucide-react';\);

// Add lightbox state
content = content.replace(\  const [archive, setArchive] = useState(null);\, \  const [archive, setArchive] = useState(null);
  const [lightboxUrl, setLightboxUrl] = useState(null);\);

// Helper component for thumbnail
const helperComponent = \

  const renderThumbnail = (url, alt) => {
    if (!url) return null;
    const isVideo = isVideoFile(url);
    return (
      <div 
        style={{ width: '100%', height: '100%', position: 'relative', cursor: 'pointer', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onClick={() => setLightboxUrl(url)}
      >
        {isVideo ? (
          <>
            <video src={url} style={{ width: '100%', height: '100%', objectFit: 'contain' }} preload="metadata" />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)' }}>
              <Play size={48} color="white" />
            </div>
          </>
        ) : (
          <img src={url} alt={alt || 'Archive Media'} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        )}
      </div>
    );
  };
\;

content = content.replace(\const winnerTeamData = archive.snapshot_teams.find(t => t.team_name === archive.winner_team_name);\, \const winnerTeamData = archive.snapshot_teams.find(t => t.team_name === archive.winner_team_name);\ + helperComponent);

// Remove specific object-fit cover logic for event poster
content = content.replace(/<img src=\{eventPoster\}.*?\/>/, \{renderThumbnail(eventPoster, 'Event Poster')}\);

// Remove for winner photo
content = content.replace(/<img src=\{winnerPhoto\} alt="Winners".*?\/>/, \{renderThumbnail(winnerPhoto, 'Winners')}\);

// Round submissions
content = content.replace(/<img src=\{sub\.image_url\}.*?objectFit: 'cover'.*?\/>/g, \
                  <div style={{ width: '100%', aspectRatio: '1', marginBottom: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {renderThumbnail(sub.image_url, 'Submission')}
                  </div>
\);

// Gallery
content = content.replace(/<img key=\{photo\.id\} src=\{photo\.image_url\}.*?objectFit: 'cover'.*?\/>/g, \
                <div key={photo.id} style={{ width: '100%', aspectRatio: '1/1', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {renderThumbnail(photo.image_url, 'Gallery')}
                </div>
\);

// Inject lightbox before closing div
content = content.replace(\      </div>
    </div>\, \      </div>
      {lightboxUrl && <MediaLightbox url={lightboxUrl} onClose={() => setLightboxUrl(null)} />}
    </div>\);

fs.writeFileSync('src/pages/Archive/ArchiveDetailPage.jsx', content);
