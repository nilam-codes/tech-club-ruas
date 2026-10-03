const fs = require('fs');
let content = fs.readFileSync('temp_admin.jsx', 'utf8');

// We need to add ImageCropper import
content = content.replace(\import Button from '../../components/common/Button/Button';\, \import Button from '../../components/common/Button/Button';\nimport ImageCropper from '../../components/common/ImageCropper';\);

// We need to add state for the cropper
const stateInsertion = \  const [editWinnerName, setEditWinnerName] = useState('');
  
  // Cropper State
  const [cropTarget, setCropTarget] = useState(null); // { type: 'poster'|'winner'|'gallery', file: File, url: string, index?: number }
  const [galleryQueue, setGalleryQueue] = useState([]); // Array of Files waiting to be cropped
  const [croppedGalleryPhotos, setCroppedGalleryPhotos] = useState([]); // Array of cropped Files ready for upload
  const [posterPreview, setPosterPreview] = useState(null);
  const [winnerPreview, setWinnerPreview] = useState(null);\;

content = content.replace(\  const [editWinnerName, setEditWinnerName] = useState('');\, stateInsertion);

// Modify file selection handlers
// For Winner Photo
const winnerFileHandler = \onChange={e => {
                    const file = e.target.files[0];
                    if (file) setCropTarget({ type: 'winner', file, url: URL.createObjectURL(file) });
                    e.target.value = null; // reset
                  }}\;
content = content.replace(/onChange=\{e => setWinnerPhotoFile\(e\.target\.files\[0\]\)\}/g, winnerFileHandler);

// For Poster
const posterFileHandler = \onChange={e => {
                    const file = e.target.files[0];
                    if (file) setCropTarget({ type: 'poster', file, url: URL.createObjectURL(file) });
                    e.target.value = null; // reset
                  }}\;
content = content.replace(/onChange=\{e => setEventPosterFile\(e\.target\.files\[0\]\)\}/g, posterFileHandler);

// For Gallery
const galleryFileHandler = \onChange={e => {
                    const files = Array.from(e.target.files);
                    if (files.length > 0) {
                      const first = files[0];
                      setCropTarget({ type: 'gallery', file: first, url: URL.createObjectURL(first) });
                      setGalleryQueue(files.slice(1));
                    }
                    e.target.value = null; // reset
                  }}\;
content = content.replace(/onChange=\{e => setEventPhotosFiles\(Array\.from\(e\.target\.files\)\)\}/g, galleryFileHandler);

// Handle Crop Save
const cropSaveLogic = \
  const handleCropSave = (croppedBlob) => {
    // Generate a file from blob
    const originalFile = cropTarget.file;
    const croppedFile = new File([croppedBlob], originalFile.name, { type: 'image/jpeg' });
    const previewUrl = URL.createObjectURL(croppedBlob);

    if (cropTarget.type === 'poster') {
      setEventPosterFile(croppedFile);
      setPosterPreview(previewUrl);
      setCropTarget(null);
    } else if (cropTarget.type === 'winner') {
      setWinnerPhotoFile(croppedFile);
      setWinnerPreview(previewUrl);
      setCropTarget(null);
    } else if (cropTarget.type === 'gallery') {
      setCroppedGalleryPhotos(prev => [...prev, { file: croppedFile, preview: previewUrl }]);
      
      // Process next in queue
      if (galleryQueue.length > 0) {
        const next = galleryQueue[0];
        setCropTarget({ type: 'gallery', file: next, url: URL.createObjectURL(next) });
        setGalleryQueue(prev => prev.slice(1));
      } else {
        setCropTarget(null);
      }
    }
  };

  const handleCropCancel = () => {
    setCropTarget(null);
    if (cropTarget.type === 'gallery') {
      // Clear queue if canceled
      setGalleryQueue([]);
    }
  };
\;

content = content.replace(\  const handleUploadPoster = async () => {\, cropSaveLogic + \\n  const handleUploadPoster = async () => {\);

// Also update the UI to show previews
// Replace the upload buttons and inputs
const posterSection = \<div>
                <h4>Event Poster</h4>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexDirection: 'column' }}>
                  {posterPreview ? (
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '2/3', background: '#000', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <img src={posterPreview} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      <button onClick={() => { setPosterPreview(null); setEventPosterFile(null); }} style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.7)', color: 'white', border: 'none', padding: '4px 8px', cursor: 'pointer' }}>Remove</button>
                    </div>
                  ) : (
                    <input type="file" style={{ flex: 1 }} accept="image/*" onChange={e => {
                      const file = e.target.files[0];
                      if (file) setCropTarget({ type: 'poster', file, url: URL.createObjectURL(file) });
                      e.target.value = null;
                    }} />
                  )}
                  <Button variant="signal" size="sm" onClick={handleUploadPoster} disabled={!eventPosterFile || loading}>SAVE / UPLOAD POSTER</Button>
                </div>
              </div>\;

const winnerSection = \<div>
                <h4>Winner Photo</h4>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexDirection: 'column' }}>
                  {winnerPreview ? (
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <img src={winnerPreview} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      <button onClick={() => { setWinnerPreview(null); setWinnerPhotoFile(null); }} style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.7)', color: 'white', border: 'none', padding: '4px 8px', cursor: 'pointer' }}>Remove</button>
                    </div>
                  ) : (
                    <>
                      <p style={{ fontSize: '12px', opacity: 0.7, margin: 0 }}>Select an image to crop</p>
                      <input type="file" style={{ flex: 1 }} accept="image/*" onChange={e => {
                        const file = e.target.files[0];
                        if (file) setCropTarget({ type: 'winner', file, url: URL.createObjectURL(file) });
                        e.target.value = null;
                      }} />
                    </>
                  )}
                  <Button variant="signal" size="sm" onClick={handleUploadWinner} disabled={!winnerPhotoFile || loading}>SAVE / UPLOAD WINNER</Button>
                </div>
              </div>\;

const gallerySection = \<div style={{ gridColumn: '1 / -1', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <h4>Event Gallery Photos</h4>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexDirection: 'column' }}>
                  
                  {croppedGalleryPhotos.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '8px', marginBottom: '8px' }}>
                      {croppedGalleryPhotos.map((p, i) => (
                        <div key={i} style={{ position: 'relative', aspectRatio: '1', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <img src={p.preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button onClick={() => setCroppedGalleryPhotos(prev => prev.filter((_, idx) => idx !== i))} style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(0,0,0,0.7)', color: 'white', border: 'none', padding: '2px 4px', fontSize: '10px', cursor: 'pointer' }}>X</button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '16px' }}>
                    <input type="file" style={{ flex: 1 }} accept="image/*" multiple onChange={e => {
                      const files = Array.from(e.target.files);
                      if (files.length > 0) {
                        const first = files[0];
                        setCropTarget({ type: 'gallery', file: first, url: URL.createObjectURL(first) });
                        setGalleryQueue(files.slice(1));
                      }
                      e.target.value = null;
                    }} />
                    <Button variant="signal" size="sm" onClick={handleUploadEventPhotos} disabled={croppedGalleryPhotos.length === 0 || loading}>SAVE / UPLOAD GALLERY ({croppedGalleryPhotos.length})</Button>
                  </div>
                </div>
              </div>\;

// Replace old HTML with new HTML using regex (this is tricky, so I'll just replace the whole Upload Official Media block)
const startIdx = content.indexOf('<h3>3. Upload Official Media</h3>');
const endIdx = content.indexOf('<div className="admin-card">\\n            <h3>4. Media Gallery</h3>');

if (startIdx !== -1 && endIdx !== -1) {
  const newUploadHtml = \<h3>3. Upload Official Media</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '16px' }}>
              \ + posterSection + \
              \ + winnerSection + \
              \ + gallerySection + \
            </div>
          </div>
          \;
  content = content.substring(0, startIdx) + newUploadHtml + content.substring(endIdx);
}

// Add Cropper Component Modal at the end of the return statement
content = content.replace(\    </div>
  );
}\, \
      {cropTarget && (
        <ImageCropper
          imageSrc={cropTarget.url}
          onCrop={handleCropSave}
          onCancel={handleCropCancel}
          aspectRatio={cropTarget.type === 'winner' ? '16/9' : cropTarget.type === 'gallery' ? '1/1' : null}
        />
      )}
    </div>
  );
}\);

// Update the actual upload functions to clear the previews upon success
content = content.replace(\setEventPosterFile(null);\, \setEventPosterFile(null); setPosterPreview(null);\);
content = content.replace(\setWinnerPhotoFile(null);\, \setWinnerPhotoFile(null); setWinnerPreview(null);\);
content = content.replace(\setEventPhotosFiles([]);\, \setCroppedGalleryPhotos([]);\);

// Fix handleUploadEventPhotos logic to loop through croppedGalleryPhotos
const newUploadGalleryLogic = \  const handleUploadEventPhotos = async () => {
    if (!archive || croppedGalleryPhotos.length === 0) return;
    setLoading(true);
    for (const item of croppedGalleryPhotos) {
      const path = \\\gallery/\\\_\\\_\\\.\\\\\\;
      const uploadRes = await uploadArchiveImage(item.file, path);
      if (uploadRes.success) {
        await addArchiveMedia({ archive_id: archive.id, media_type: 'event_photo', image_url: uploadRes.url });
      }
    }
    setCroppedGalleryPhotos([]);
    await loadArchive();
    setLoading(false);
  };\;

content = content.replace(/const handleUploadEventPhotos = async \(\) => \{[\s\S]*?setLoading\(false\);\n  \};/, newUploadGalleryLogic);

fs.writeFileSync('src/pages/Admin/AdminArchivePanel.jsx', content);
