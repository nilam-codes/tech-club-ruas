import re

with open('src/components/common/MediaLightbox/MediaLightbox.css', 'r') as f:
    content = f.read()

content = content.replace("rgba(255, 255, 255, 0.1)", "var(--border-strong)")
content = content.replace("rgba(255, 255, 255, 0.2)", "var(--accent-cyan)")
content = content.replace("rgba(255,255,255,0.1)", "var(--border-strong)")
content = content.replace("color: #fff;", "color: var(--accent-cyan);")

with open('src/components/common/MediaLightbox/MediaLightbox.css', 'w') as f:
    f.write(content)
