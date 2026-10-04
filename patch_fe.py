import re

with open('src/components/home/FeaturedEvents/FeaturedEvents.jsx', 'r') as f:
    content = f.read()

content = content.replace('className="event-card"', 'className="event-card corner-brackets"')

with open('src/components/home/FeaturedEvents/FeaturedEvents.jsx', 'w') as f:
    f.write(content)
