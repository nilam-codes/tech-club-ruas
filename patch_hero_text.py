import re

with open('src/components/home/Hero/Hero.jsx', 'r') as f:
    content = f.read()

content = content.replace("RAMAIAH UNIVERSITY OF APPLIED SCIENCES", "DEPARTMENT OF COMPUTER APPLICATIONS")

with open('src/components/home/Hero/Hero.jsx', 'w') as f:
    f.write(content)
