import re

with open('src/components/home/BuiltByClub/BuiltByClub.css', 'r') as f:
    content = f.read()

content = content.replace("background: rgba(255, 255, 255, 0.7);", "background: rgba(10, 18, 16, 0.7);")
content = content.replace("border: 1px solid rgba(0,0,0,0.05);", "border: 1px solid var(--border-strong);")

with open('src/components/home/BuiltByClub/BuiltByClub.css', 'w') as f:
    f.write(content)
