import re

with open('src/components/layout/Navbar/Navbar.css', 'r') as f:
    content = f.read()

content = content.replace("font-family: var(--font-heading);", "font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.05em;")

with open('src/components/layout/Navbar/Navbar.css', 'w') as f:
    f.write(content)
