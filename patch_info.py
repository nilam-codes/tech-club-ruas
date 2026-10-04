import re

with open('src/data/clubInfo.js', 'r') as f:
    content = f.read()

content = content.replace('"THINK. BUILD. BELONG."', '"A PLACE FOR CURIOUS MINDS."')
content = content.replace('["THINK.", "BUILD.", "BELONG."]', '["A PLACE FOR", "CURIOUS MINDS."]')

with open('src/data/clubInfo.js', 'w') as f:
    f.write(content)
