import React, { useState, useRef, useEffect } from 'react';
import Button from './Button/Button';

export default function ImageCropper({ imageSrc, onCrop, onCancel, aspectRatio }) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  
  // Center image initially
  useEffect(() => {
    setOffset({ x: 0, y: 0 });
    setZoom(1);
  }, [imageSrc]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomIn = e.deltaY < 0;
    setZoom(prev => Math.max(0.1, Math.min(prev + (zoomIn ? 0.1 : -0.1), 5)));
  };

  const cropImage = () => {
    if (!imageRef.current || !containerRef.current) return;
    const canvas = document.createElement('canvas');
    const containerRect = containerRef.current.getBoundingClientRect();
    const imageRect = imageRef.current.getBoundingClientRect();

    const DPR = 2; // Output at 2x resolution for better quality
    canvas.width = containerRect.width * DPR;
    canvas.height = containerRect.height * DPR;
    
    const ctx = canvas.getContext('2d');
    
    // We want to map the image onto the canvas exactly as it appears in the container
    const scaleX = imageRef.current.naturalWidth / imageRect.width;
    const scaleY = imageRef.current.naturalHeight / imageRect.height;

    const cropX = (containerRect.left - imageRect.left) * scaleX;
    const cropY = (containerRect.top - imageRect.top) * scaleY;
    const cropW = containerRect.width * scaleX;
    const cropH = containerRect.height * scaleY;

    // Draw to canvas scaling it by DPR
    ctx.drawImage(
      imageRef.current,
      cropX, cropY, cropW, cropH,
      0, 0, canvas.width, canvas.height
    );

    canvas.toBlob((blob) => {
      onCrop(blob);
    }, 'image/jpeg', 0.92);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.9)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#14161d', border: '1px solid #30323a', padding: '24px', width: '90%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <h3 style={{ color: '#f5f5f5', margin: 0 }}>Crop Image</h3>
        
        <div 
          ref={containerRef}
          style={{ 
            width: '100%', 
            height: '400px', 
            background: '#000', 
            overflow: 'hidden', 
            position: 'relative',
            cursor: isDragging ? 'grabbing' : 'grab',
            aspectRatio: aspectRatio || 'auto',
            margin: '0 auto',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          <img 
            ref={imageRef}
            src={imageSrc} 
            alt="Crop target" 
            style={{ 
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${zoom})`,
              transformOrigin: 'center',
              pointerEvents: 'none',
              maxWidth: 'none',
              maxHeight: 'none'
            }} 
            draggable={false}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#fff', fontSize: '12px' }}>Zoom:</span>
          <input 
            type="range" 
            min="0.1" 
            max="5" 
            step="0.1" 
            value={zoom} 
            onChange={(e) => setZoom(parseFloat(e.target.value))} 
            style={{ flex: 1 }}
          />
          <Button variant="outline" size="sm" onClick={() => { setZoom(1); setOffset({x:0, y:0}); }}>Reset</Button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '8px' }}>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button variant="signal" onClick={cropImage}>Save Crop</Button>
        </div>
      </div>
    </div>
  );
}
