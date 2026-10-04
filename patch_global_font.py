import re

with open('src/assets/styles/global.css', 'r') as f:
    content = f.read()

content = content.replace("  color: var(--text-primary);\n  text-transform: uppercase;\n}", "  color: var(--text-primary);\n}")

with open('src/assets/styles/global.css', 'w') as f:
    f.write(content)
