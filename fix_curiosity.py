import re

with open('src/components/home/CuriositySection/CuriositySection.jsx', 'r') as f:
    content = f.read()

content = content.replace("style={{ transitionDelay: \\s\ }}", "style={{ transitionDelay: ${index * 0.1}s }}")

with open('src/components/home/CuriositySection/CuriositySection.jsx', 'w') as f:
    f.write(content)
