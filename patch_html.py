import re

with open('index.html', 'r') as f:
    content = f.read()

old_link = 'family=JetBrains+Mono:wght@400;500;600;700&family=Orbitron:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap'
new_link = 'family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap'

content = content.replace(old_link, new_link)

with open('index.html', 'w') as f:
    f.write(content)
