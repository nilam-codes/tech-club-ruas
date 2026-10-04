import re

with open('src/pages/Home/HomePage.jsx', 'r') as f:
    content = f.read()

content = content.replace('{/* 8. Join the Club CTA */}', '{/* 8. Social CTA */}')

with open('src/pages/Home/HomePage.jsx', 'w') as f:
    f.write(content)
