import re

with open('src/components/layout/Footer/Footer.css', 'r') as f:
    content = f.read()

content = content.replace("background-color: var(--accent-signal);", "background-color: var(--accent-green);")
content = content.replace("background: var(--bg-surface);", "background: transparent;")

with open('src/components/layout/Footer/Footer.css', 'w') as f:
    f.write(content)
