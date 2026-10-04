const fs = require('fs');
let content = fs.readFileSync('src/pages/Admin/AdminArchivePanel.jsx', 'utf8');

const targetPoster = \    const handleUploadPoster = async () => {
      if (!archive || !eventPosterFile) return;
      setLoading(true);
      const path = \\\poster/\_\.\\\\;
      const uploadRes = await uploadArchiveImage(eventPosterFile, path);
      if (uploadRes.success) {
        const existing = media.find(m => m.media_type === 'event_poster');
        if (existing) {
          if (existing.image_url) await deleteArchiveImage(existing.image_url);
          await deleteArchiveMedia(existing.id);
        }
        await addArchiveMedia({ archive_id: archive.id, media_type: 'event_poster', image_url: uploadRes.url });
        await supabase.from('event_archives').update({ event_poster_url: uploadRes.url }).eq('id', archive.id);
        setEventPosterFile(null);
        setPosterPreview(null);
        await loadArchive();
      } else {
        alert('Upload failed: ' + uploadRes.error);
      }
      setLoading(false);
    };\;

const repPoster = \    const handleUploadPoster = async () => {
      if (!archive || !eventPosterFile) return;
      setLoading(true);
      const path = \\\poster/\_\.\\\\;
      const uploadRes = await uploadArchiveImage(eventPosterFile, path);
      if (uploadRes.success) {
        const existing = media.find(m => m.media_type === 'event_poster');
        
        await addArchiveMedia({ archive_id: archive.id, media_type: 'event_poster', image_url: uploadRes.url });
        await supabase.from('event_archives').update({ event_poster_url: uploadRes.url }).eq('id', archive.id);
        
        if (existing) {
          await deleteArchiveMedia(existing.id);
          if (existing.image_url) await deleteArchiveImage(existing.image_url);
        }
        
        setEventPosterFile(null);
        setPosterPreview(null);
        await loadArchive();
      } else {
        alert('Upload failed: ' + uploadRes.error);
      }
      setLoading(false);
    };\;

content = content.replace(targetPoster, repPoster);
fs.writeFileSync('src/pages/Admin/AdminArchivePanel.jsx', content);
