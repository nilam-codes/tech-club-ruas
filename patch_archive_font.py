import re

with open('src/pages/Archive/ArchiveDetailPage.jsx', 'r') as f:
    content = f.read()

content = content.replace("textTransform: 'uppercase', ", "")
content = content.replace(", textTransform: 'uppercase'", "")

with open('src/pages/Archive/ArchiveDetailPage.jsx', 'w') as f:
    f.write(content)
