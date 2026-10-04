import re

with open('src/pages/Archive/ArchiveDetailPage.jsx', 'r') as f:
    content = f.read()

bad_text = '''          </div>
        )}

        </FadeInSection>
        )}'''

good_text = '''          </div>
          </FadeInSection>
        )}'''

content = content.replace(bad_text, good_text)

with open('src/pages/Archive/ArchiveDetailPage.jsx', 'w') as f:
    f.write(content)
