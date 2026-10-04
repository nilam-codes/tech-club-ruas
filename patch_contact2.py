import re

with open('src/pages/Contact/ContactPage.jsx', 'r') as f:
    content = f.read()

content = content.replace("or submit an application to join the collective", "")

with open('src/pages/Contact/ContactPage.jsx', 'w') as f:
    f.write(content)
