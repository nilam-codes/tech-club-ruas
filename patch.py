import sys

with open('src/pages/Admin/AdminArchivePanel.jsx', 'r') as f:
    content = f.read()

target = '''<input type="file" style={{ flex: 1 }} accept="image/*" multiple onChange={e => {
                        const files = Array.from(e.target.files);
                        if (files.length > 0) {
                          const first = files[0];
                          setCropTarget({ type: 'gallery', file: first, url: URL.createObjectURL(first) });
                          setGalleryQueue(files.slice(1));
                        }
                        e.target.value = null;
                      }} />'''

replacement = '''<input type="file" style={{ flex: 1 }} accept="image/*,video/mp4,video/webm,video/quicktime" multiple onChange={e => {
                        const files = Array.from(e.target.files);
                        if (files.length > 0) {
                          const first = files[0];
                          if (first.type.startsWith('video/')) {
                            setCroppedGalleryPhotos(prev => [...prev, { file: first, preview: URL.createObjectURL(first), isVideo: true }]);
                            files.slice(1).forEach(f => {
                              if (f.type.startsWith('video/')) setCroppedGalleryPhotos(c => [...c, { file: f, preview: URL.createObjectURL(f), isVideo: true }]);
                              else setGalleryQueue(c => [...c, f]);
                            });
                          } else {
                            setCropTarget({ type: 'gallery', file: first, url: URL.createObjectURL(first) });
                            setGalleryQueue(files.slice(1));
                          }
                        }
                        e.target.value = null;
                      }} />'''

content = content.replace(target, replacement)

# Replace other accept="image/*" to include videos for Replace operations
content = content.replace('accept="image/*"', 'accept="image/*,video/mp4,video/webm,video/quicktime"')

with open('src/pages/Admin/AdminArchivePanel.jsx', 'w') as f:
    f.write(content)
