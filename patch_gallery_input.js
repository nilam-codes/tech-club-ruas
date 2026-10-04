const fs = require('fs');
let content = fs.readFileSync('src/pages/Admin/AdminArchivePanel.jsx', 'utf8');

const targetGalleryInput = \                    <div style={{ display: 'flex', gap: '16px' }}>
                      <input type="file" style={{ flex: 1 }} accept="image/*" multiple onChange={e => {
                        const files = Array.from(e.target.files);
                        if (files.length > 0) {
                          const first = files[0];
                          setCropTarget({ type: 'gallery', file: first, url: URL.createObjectURL(first) });
                          setGalleryQueue(files.slice(1));
                        }
                        e.target.value = null;
                      }} />\;

const repGalleryInput = \                    <div style={{ display: 'flex', gap: '16px' }}>
                      <input type="file" style={{ flex: 1 }} accept="image/*,video/mp4,video/webm,video/quicktime" multiple onChange={e => {
                        const files = Array.from(e.target.files);
                        if (files.length > 0) {
                          const first = files[0];
                          const isVid = first.type.startsWith('video/');
                          if (isVid) {
                            setCroppedGalleryPhotos(prev => [...prev, { file: first, preview: URL.createObjectURL(first), isVideo: true }]);
                            // Handle rest of queue immediately if there are more
                            const remaining = files.slice(1);
                            remaining.forEach(f => {
                              if (f.type.startsWith('video/')) {
                                setCroppedGalleryPhotos(curr => [...curr, { file: f, preview: URL.createObjectURL(f), isVideo: true }]);
                              } else {
                                setGalleryQueue(curr => [...curr, f]);
                              }
                            });
                          } else {
                            setCropTarget({ type: 'gallery', file: first, url: URL.createObjectURL(first) });
                            setGalleryQueue(files.slice(1));
                          }
                        }
                        e.target.value = null;
                      }} />\;

content = content.replace(targetGalleryInput, repGalleryInput);
fs.writeFileSync('src/pages/Admin/AdminArchivePanel.jsx', content);
