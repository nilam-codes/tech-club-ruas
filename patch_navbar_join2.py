import re

with open('src/components/layout/Navbar/Navbar.jsx', 'r') as f:
    content = f.read()

content = content.replace("Join Club", "Contact")

with open('src/components/layout/Navbar/Navbar.jsx', 'w') as f:
    f.write(content)
