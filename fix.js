const fs = require('fs');
let content = fs.readFileSync('src/pages/Archive/ArchiveDetailPage.jsx', 'utf8');
content = content.replace(\  );
}
      {lightboxUrl && <MediaLightbox url={lightboxUrl} onClose={() => setLightboxUrl(null)} />}
    </div>\, \      {lightboxUrl && <MediaLightbox url={lightboxUrl} onClose={() => setLightboxUrl(null)} />}
    </div>
  );
}\);
fs.writeFileSync('src/pages/Archive/ArchiveDetailPage.jsx', content);
