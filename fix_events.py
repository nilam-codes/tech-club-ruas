import re

with open('src/components/home/FeaturedEvents/FeaturedEvents.jsx', 'r') as f:
    content = f.read()

content = content.replace("transform: \perspective(1000px) rotateX(\deg) rotateY(\deg) scale3d(1.02, 1.02, 1.02)\,", "transform: perspective(1000px) rotateX(deg) rotateY(deg) scale3d(1.02, 1.02, 1.02),")
content = content.replace("{event.ctaText ? \[\]\ : '[REGISTER]'}", "{event.ctaText ? [] : '[REGISTER]'}")
content = content.replace("className={\	imeline-filter-btn \\}", "className={	imeline-filter-btn }")
content = content.replace("className={\	imeline-filter-btn \\}", "className={	imeline-filter-btn }")
content = content.replace("className={\	imeline-filter-btn \\}", "className={	imeline-filter-btn }")

with open('src/components/home/FeaturedEvents/FeaturedEvents.jsx', 'w') as f:
    f.write(content)
