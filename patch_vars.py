import re

with open('src/assets/styles/variables.css', 'r') as f:
    content = f.read()

content = re.sub(r"--font-heading:\s*'[^']+'.*?;", "--font-heading: 'Space Grotesk', sans-serif;", content)
content = re.sub(r"--font-body:\s*'[^']+'.*?;", "--font-body: 'Inter', sans-serif;", content)
content = re.sub(r"--font-mono:\s*'[^']+'.*?;", "--font-mono: 'JetBrains Mono', monospace;", content)

with open('src/assets/styles/variables.css', 'w') as f:
    f.write(content)
