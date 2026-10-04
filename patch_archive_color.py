import re

with open('src/pages/Archive/ArchiveDetailPage.jsx', 'r') as f:
    content = f.read()

content = content.replace("rgba(255, 60, 0, 0.05)", "rgba(0, 245, 255, 0.05)")

with open('src/pages/Archive/ArchiveDetailPage.jsx', 'w') as f:
    f.write(content)
