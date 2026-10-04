import re

with open('src/components/home/BuiltByClub/BuiltByClub.jsx', 'r') as f:
    content = f.read()

content = content.replace("'rgba(40, 40, 40, 0.4)'", "'rgba(57, 255, 20, 0.4)'")
content = content.replace("rgba(255, 70, 18, ", "rgba(0, 245, 255, ")
content = content.replace("rgba(40, 40, 40, ", "rgba(57, 255, 20, ")

with open('src/components/home/BuiltByClub/BuiltByClub.jsx', 'w') as f:
    f.write(content)
