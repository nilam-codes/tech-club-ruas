import re

with open('src/components/home/SocialCTA/SocialCTA.jsx', 'r') as f:
    content = f.read()

content = content.replace('<span>06 / MEMBERSHIP & INTAKE</span>', '<span className="section-index-cat">$ ./connect</span>')
content = content.replace('Interested in Building With Us?', 'Stay Connected')
content = content.replace('Apply for Membership', 'Contact Us')

with open('src/components/home/SocialCTA/SocialCTA.jsx', 'w') as f:
    f.write(content)
