import re

with open('src/pages/Admin/AdminArchivePanel.jsx', 'r') as f:
    content = f.read()

direct_replace = '''  const handleDirectReplace = async (mediaTarget, file) => {
    if (!archive) return;
    setLoading(true);
    const ext = file.name.split('.').pop() || 'mp4';
    let folder = 'gallery';
    if (mediaTarget.media_type === 'event_poster') folder = 'poster';
    if (mediaTarget.media_type === 'winner_photo') folder = 'winner';
    const path = \/\_\_replaced.\;
    
    const uploadRes = await uploadArchiveImage(file, path);
    if (!uploadRes.success) {
      alert('Media update failed. The existing media was kept.');
      setLoading(false);
      return;
    }
    
    const { error: updateError } = await supabase
      .from('event_archive_media')
      .update({ image_url: uploadRes.url })
      .eq('id', mediaTarget.id);
      
    if (updateError) {
      alert('Media update failed at database level. The existing media was kept.');
      setLoading(false);
      return;
    }

    if (mediaTarget.media_type === 'event_poster') {
      await supabase.from('event_archives').update({ event_poster_url: uploadRes.url }).eq('id', archive.id);
    } else if (mediaTarget.media_type === 'winner_photo') {
      await supabase.from('event_archives').update({ winner_photo_url: uploadRes.url }).eq('id', archive.id);
    }

    if (mediaTarget.image_url) {
      await deleteArchiveImage(mediaTarget.image_url);
    }

    alert('Media replaced successfully.');
    await loadArchive();
    setLoading(false);
  };
'''

content = content.replace('// Crop Handlers', direct_replace + '\n  // Crop Handlers')

edit_btn_pattern = r'<\!m\.media_type\.startsWith\(\'round\'\) && \(\s*<button\s*onClick=\{([^}]+)\}\s*style=\{\{\s*position: \'absolute\', top: \'4px\', right: \'54px\', background: \'var\(--color-brand-orange\)\', color: \'white\', padding: \'4px 8px\', fontSize: \'10px\', cursor: \'pointer\', border: \'none\' \}\}\s*>\s*Edit\s*</button>\s*\)'

edit_btn_replacement = '''{!m.media_type.startsWith('round') && (
                      <label 
                        style={{ position: 'absolute', top: '4px', right: '54px', background: 'var(--color-brand-orange)', color: 'white', padding: '4px 8px', fontSize: '10px', cursor: 'pointer', border: 'none' }}
                      >
                        REPLACE
                        <input type="file" accept="image/*,video/mp4,video/webm,video/quicktime" style={{display:'none'}} onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          if (file.type.startsWith('video/')) {
                            await handleDirectReplace(m, file);
                          } else {
                            setEditMediaTarget({ ...m, original_url: m.image_url, image_url: URL.createObjectURL(file), pendingFile: file });
                          }
                          e.target.value = null;
                        }} />
                      </label>
                    )}'''

content = re.sub(r'\{\!m\.media_type\.startsWith\(\'round\'\) && \(\s*<button\s*onClick=\{\(\) => setEditMediaTarget\(m\)\}\s*style=\{\{ position: \'absolute\', top: \'4px\', right: \'54px\', background: \'var\(--color-brand-orange\)\', color: \'white\', padding: \'4px 8px\', fontSize: \'10px\', cursor: \'pointer\', border: \'none\' \}\}\s*>\s*Edit\s*</button>\s*\)\}', edit_btn_replacement, content)

# Update handleEditCropSave to use original_url if available
crop_save_pattern = r'if \(editMediaTarget\.image_url\) \{\s*await deleteArchiveImage\(editMediaTarget\.image_url\);\s*\}'
crop_save_repl = r'''if (editMediaTarget.original_url || editMediaTarget.image_url) {
      await deleteArchiveImage(editMediaTarget.original_url || editMediaTarget.image_url);
    }'''

content = re.sub(crop_save_pattern, crop_save_repl, content)

with open('src/pages/Admin/AdminArchivePanel.jsx', 'w') as f:
    f.write(content)
