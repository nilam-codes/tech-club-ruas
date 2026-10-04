import re

with open('src/pages/About/AboutPage.jsx', 'r') as f:
    content = f.read()

content = content.replace("Apply to Join Club", "Contact Us")

with open('src/pages/About/AboutPage.jsx', 'w') as f:
    f.write(content)
