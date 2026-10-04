import re

with open('src/pages/Archive/ArchiveDetailPage.jsx', 'r') as f:
    content = f.read()

# Fix winner section braces
bad_pattern = r'\}\)\}\s*<\/FadeInSection>\s*\)\}'
good_pattern = '})}</FadeInSection>)}'
content = re.sub(bad_pattern, good_pattern, content)

with open('src/pages/Archive/ArchiveDetailPage.jsx', 'w') as f:
    f.write(content)
