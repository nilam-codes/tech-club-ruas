import re

with open('src/components/layout/Navbar/Navbar.css', 'r') as f:
    content = f.read()

content = content.replace("rgba(253, 252, 248, ", "rgba(10, 18, 16, ")
content = content.replace("background: rgba(0, 0, 0, 0.03);", "background: rgba(0, 245, 255, 0.1);")

with open('src/components/layout/Navbar/Navbar.css', 'w') as f:
    f.write(content)
