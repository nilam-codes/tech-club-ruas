import re

with open('src/pages/Admin/AdminArchivePanel.jsx', 'r') as f:
    content = f.read()

# For Event Poster
poster_pattern = r'<input type="file" style=\{\{ flex: 1 \}\} accept="image/\*,video/mp4,video/webm,video/quicktime" onChange=\{e => \{\s*const file = e\.target\.files\[0\];\s*if \(file\) setCropTarget\(\{ type: \'poster\', file, url: URL\.createObjectURL\(file\) \}\);\s*e\.target\.value = null;\s*\}\} />'
poster_replacement = '''<input type="file" style={{ flex: 1 }} accept="image/*,video/mp4,video/webm,video/quicktime" onChange={e => {
                        const file = e.target.files[0];
                        if (file) {
                          if (file.type.startsWith('video/')) {
                            setEventPosterFile(file);
                            setPosterPreview(URL.createObjectURL(file));
                          } else {
                            setCropTarget({ type: 'poster', file, url: URL.createObjectURL(file) });
                          }
                        }
                        e.target.value = null;
                      }} />'''

content = re.sub(poster_pattern, poster_replacement, content)

# For Winner Photo
winner_pattern = r'<input type="file" style=\{\{ flex: 1 \}\} accept="image/\*,video/mp4,video/webm,video/quicktime" onChange=\{e => \{\s*const file = e\.target\.files\[0\];\s*if \(file\) setCropTarget\(\{ type: \'winner\', file, url: URL\.createObjectURL\(file\) \}\);\s*e\.target\.value = null;\s*\}\} />'
winner_replacement = '''<input type="file" style={{ flex: 1 }} accept="image/*,video/mp4,video/webm,video/quicktime" onChange={e => {
                          const file = e.target.files[0];
                          if (file) {
                            if (file.type.startsWith('video/')) {
                              setWinnerPhotoFile(file);
                              setWinnerPreview(URL.createObjectURL(file));
                            } else {
                              setCropTarget({ type: 'winner', file, url: URL.createObjectURL(file) });
                            }
                          }
                          e.target.value = null;
                        }} />'''

content = re.sub(winner_pattern, winner_replacement, content)

with open('src/pages/Admin/AdminArchivePanel.jsx', 'w') as f:
    f.write(content)
