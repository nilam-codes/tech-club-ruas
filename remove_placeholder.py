import re

with open('src/components/home/FeaturedEvents/FeaturedEvents.jsx', 'r') as f:
    content = f.read()

pattern = r'\s*<div className="event-card-image-bg">\s*<div className="event-card-abstract-pattern"><\/div>\s*<\/div>'
content = re.sub(pattern, '', content)

with open('src/components/home/FeaturedEvents/FeaturedEvents.jsx', 'w') as f:
    f.write(content)
