import re

with open('src/pages/Admin/AdminArchivePanel.jsx', 'r') as f:
    content = f.read()

# Replace img tags in preview with render helper
preview_img = r'<img src=\{(posterPreview|winnerPreview)\} style=\{\{ width: \'100%\', height: \'100%\', objectFit: \'contain\' \}\} />'
preview_repl = r'''{isVideoFile(\1) || (\1 && \1.startsWith('blob:') && \1.includes('video')) ? <video src={\1} style={{ width: '100%', height: '100%', objectFit: 'contain' }} controls /> : <img src={\1} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}'''
content = re.sub(preview_img, preview_repl, content)

# Replace cropped gallery preview
crop_img = r'<img src=\{p\.preview\} style=\{\{ width: \'100%\', height: \'100%\', objectFit: \'cover\' \}\} />'
crop_repl = r'''{p.isVideo ? <video src={p.preview} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <img src={p.preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}'''
content = re.sub(crop_img, crop_repl, content)

# Replace Media Gallery mapped image
media_img = r'<img src=\{m\.image_url\} alt=\{m\.media_type\} style=\{\{ width: \'100%\', height: \'120px\', objectFit: \'cover\' \}\} />'
media_repl = r'''<div style={{ width: '100%', height: '120px', position: 'relative', background: '#000' }}>
                      {isVideoFile(m.image_url) ? (
                        <>
                          <video src={m.image_url} style={{ width: '100%', height: '100%', objectFit: 'contain' }} preload="metadata" />
                          <div style={{ position: 'absolute', top: 4, left: 4, background: 'rgba(0,0,0,0.7)', color: 'white', padding: '2px 4px', fontSize: '10px' }}>VIDEO</div>
                        </>
                      ) : (
                        <>
                          <img src={m.image_url} alt={m.media_type} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                          <div style={{ position: 'absolute', top: 4, left: 4, background: 'rgba(0,0,0,0.7)', color: 'white', padding: '2px 4px', fontSize: '10px' }}>PHOTO</div>
                        </>
                      )}
                    </div>'''
content = re.sub(media_img, media_repl, content)

with open('src/pages/Admin/AdminArchivePanel.jsx', 'w') as f:
    f.write(content)
