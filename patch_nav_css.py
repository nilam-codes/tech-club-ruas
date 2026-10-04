import re

with open('src/components/layout/Navbar/Navbar.css', 'r') as f:
    content = f.read()

content = content.replace("rgba(253, 252, 248, ", "rgba(5, 8, 7, ")

with open('src/components/layout/Navbar/Navbar.css', 'w') as f:
    f.write(content)
