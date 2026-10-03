const fs = require('fs');
let content = fs.readFileSync('temp_admin.jsx', 'utf8');

// 1. Add editMediaTarget state
const stateReplacement = \const [winnerPreview, setWinnerPreview] = useState(null);
  const [editMediaTarget, setEditMediaTarget] = useState(null);\;
content = content.replace('const [winnerPreview, setWinnerPreview] = useState(null);', stateReplacement);

// 2. Add handleEditCropSave
const editCropSaveCode = \
  const handleEditCropSave = async (croppedBlob) => {
    if (!editMediaTarget || !archive) return;
    
    // Create File from Blob
    const ext = editMediaTarget.image_url.split('.').pop() || 'jpg';
    const croppedFile = new File([croppedBlob], \\\edited_\\\.\\\\\\, { type: 'image/jpeg' });
    
    setLoading(true);
    setEditMediaTarget(null); // close cropper
    
    // Generate new path based on media type
    let folder = 'gallery';
    if (editMediaTarget.media_type === 'event_poster') folder = 'poster';
    if (editMediaTarget.media_type === 'winner_photo') folder = 'winner';
    const path = \\\\\\/\\\_\\\_edited.\\\\\\;
    
    // 1. Upload new File to Supabase
    const uploadRes = await uploadArchiveImage(croppedFile, path);
    if (!uploadRes.success) {
      alert('Image update failed. The existing image was kept.');
      setLoading(false);
      return;
    }
    
    // 2. Update the existing media record
    const { error: updateError } = await supabase
      .from('event_archive_media')
      .update({ image_url: uploadRes.url })
      .eq('id', editMediaTarget.id);
      
    if (updateError) {
      alert('Image update failed at database level. The existing image was kept.');
      setLoading(false);
      return;
    }

    // 3. Update event_archives if necessary
    if (editMediaTarget.media_type === 'event_poster') {
      await supabase.from('event_archives').update({ event_poster_url: uploadRes.url }).eq('id', archive.id);
    } else if (editMediaTarget.media_type === 'winner_photo') {
      await supabase.from('event_archives').update({ winner_photo_url: uploadRes.url }).eq('id', archive.id);
    }

    // 4. Delete old storage object ONLY AFTER success
    if (editMediaTarget.image_url) {
      await deleteArchiveImage(editMediaTarget.image_url);
    }

    alert('Image updated successfully.');
    await loadArchive();
    setLoading(false);
  };
\;

content = content.replace('// Crop Handlers', '// Crop Handlers' + editCropSaveCode);

// 3. Add Edit button to Gallery
const oldGalleryHTML = \<button onClick={() => handleDeleteMedia(m.id)} style={{ position: 'absolute', top: '4px', right: '4px', background: 'red', color: 'white', padding: '4px 8px', fontSize: '10px', cursor: 'pointer', border: 'none' }}>
                      Delete
                    </button>\;
const newGalleryHTML = \{!m.media_type.startsWith('round') && (
                      <button 
                        onClick={() => setEditMediaTarget(m)} 
                        style={{ position: 'absolute', top: '4px', right: '54px', background: 'var(--color-brand-orange)', color: 'white', padding: '4px 8px', fontSize: '10px', cursor: 'pointer', border: 'none' }}
                      >
                        Edit
                      </button>
                    )}
                    <button onClick={() => handleDeleteMedia(m.id)} style={{ position: 'absolute', top: '4px', right: '4px', background: 'red', color: 'white', padding: '4px 8px', fontSize: '10px', cursor: 'pointer', border: 'none' }}>
                      Delete
                    </button>\;
content = content.replace(oldGalleryHTML, newGalleryHTML);

// 4. Add ImageCropper for editMediaTarget at the bottom
const cropperHTML = \{editMediaTarget && (
        <ImageCropper
          imageSrc={editMediaTarget.image_url}
          onCrop={handleEditCropSave}
          onCancel={() => setEditMediaTarget(null)}
          aspectRatio={editMediaTarget.media_type === 'winner_photo' ? '16/9' : editMediaTarget.media_type === 'event_photo' ? '1/1' : null}
        />
      )}\;
content = content.replace('</div>\\n  );\\n}', cropperHTML + '\\n    </div>\\n  );\\n}');

fs.writeFileSync('src/pages/Admin/AdminArchivePanel.jsx', content);
