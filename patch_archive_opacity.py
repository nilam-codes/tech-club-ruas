import re

with open('src/pages/Archive/ArchiveDetailPage.jsx', 'r') as f:
    content = f.read()

content = content.replace("rgba(255,255,255,0.1)", "var(--border-strong)")
content = content.replace("rgba(255,255,255,0.2)", "var(--border-strong)")
content = content.replace("rgba(255,255,255,0.05)", "var(--border-subtle)")
content = content.replace("rgba(255,255,255,0.02)", "var(--bg-surface)")
content = content.replace("rgba(255,255,255,0.03)", "var(--bg-surface)")

with open('src/pages/Archive/ArchiveDetailPage.jsx', 'w') as f:
    f.write(content)
