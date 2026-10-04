import re

with open('src/components/home/FeaturedEvents/FeaturedEvents.css', 'r') as f:
    content = f.read()

pattern = r'\.event-card-image-bg \{[\s\S]*?\}\s*\.event-card-wrapper:hover \.event-card-image-bg \{[\s\S]*?\}'
content = re.sub(pattern, '', content)

with open('src/components/home/FeaturedEvents/FeaturedEvents.css', 'w') as f:
    f.write(content)
