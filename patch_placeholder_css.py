import re

with open('src/components/common/ImagePlaceholder/ImagePlaceholder.css', 'r') as f:
    content = f.read()

content = content.replace("background: #12141c;", "background: var(--bg-surface);")

with open('src/components/common/ImagePlaceholder/ImagePlaceholder.css', 'w') as f:
    f.write(content)
