import re

with open('src/pages/Contact/ContactPage.jsx', 'r') as f:
    content = f.read()

content = content.replace('category="MEMBERSHIP & INQUIRIES"', 'category="INQUIRIES"')
content = content.replace('title={Contact & Join }', 'title={Contact }')
content = content.replace('subtitle={Reach out to the student coordinators or submit an application to join the collective at .}', 'subtitle={Reach out to the student coordinators at .}')

with open('src/pages/Contact/ContactPage.jsx', 'w') as f:
    f.write(content)
