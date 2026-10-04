import re

with open('src/components/common/HorizontalGallery/HorizontalGallery.jsx', 'r') as f:
    content = f.read()

content = content.replace("rgba(255,255,255,0.1)", "var(--border-strong)")

with open('src/components/common/HorizontalGallery/HorizontalGallery.jsx', 'w') as f:
    f.write(content)
