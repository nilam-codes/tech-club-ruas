import re

with open('src/components/home/CuriositySection/CuriositySection.jsx', 'r') as f:
    content = f.read()

content = content.replace('{topic.id} &mdash;', '// {topic.id}')

with open('src/components/home/CuriositySection/CuriositySection.jsx', 'w') as f:
    f.write(content)
