import re

with open('src/data/navigation.js', 'r') as f:
    content = f.read()

content = content.replace('{ id: "contact", label: "Contact / Join", href: "#contact" }', '{ id: "contact", label: "Contact", href: "#contact" }')

with open('src/data/navigation.js', 'w') as f:
    f.write(content)
