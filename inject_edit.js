const fs = require('fs');
let content = fs.readFileSync('src/pages/Admin/AdminArchivePanel.jsx', 'utf8');

const target = \                      </div>
                    )}
  
                    <button 
                      onClick={() => handleDeleteMedia(m.id)}\;
                      
const replacement = \                      </div>
                    )}
  
                    {!m.media_type.startsWith('round') && (
                      <button 
                        onClick={() => setEditMediaTarget(m)} 
                        style={{ position: 'absolute', top: '4px', right: '54px', background: 'var(--color-brand-orange)', color: 'white', padding: '4px 8px', fontSize: '10px', cursor: 'pointer', border: 'none' }}
                      >
                        Edit
                      </button>
                    )}
                    <button 
                      onClick={() => handleDeleteMedia(m.id)}\;

content = content.replace(target, replacement);

const cropperHTML = \
      {cropTarget && (
        <ImageCropper
          imageSrc={cropTarget.url}
          onCrop={handleCropSave}
          onCancel={handleCropCancel}
          aspectRatio={cropTarget.type === 'winner' ? '16/9' : cropTarget.type === 'gallery' ? '1/1' : null}
        />
      )}
      
      {editMediaTarget && (
        <ImageCropper
          imageSrc={editMediaTarget.image_url}
          onCrop={handleEditCropSave}
          onCancel={() => setEditMediaTarget(null)}
          aspectRatio={editMediaTarget.media_type === 'winner_photo' ? '16/9' : editMediaTarget.media_type === 'event_photo' ? '1/1' : null}
        />
      )}
    </div>
  );
}\;

content = content.replace(/\{cropTarget && \([\s\S]*?\}\)[\s\S]*?<\/div>[\s\S]*?\);\n\}/, cropperHTML);

fs.writeFileSync('src/pages/Admin/AdminArchivePanel.jsx', content);
