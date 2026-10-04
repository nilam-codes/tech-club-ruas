import re

with open('src/components/home/TeamSpotlight/TeamSpotlight.jsx', 'r') as f:
    content = f.read()

content = content.replace('className="team-member-card"', 'className="team-member-card corner-brackets"')

with open('src/components/home/TeamSpotlight/TeamSpotlight.jsx', 'w') as f:
    f.write(content)
