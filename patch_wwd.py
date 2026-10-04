import re

with open('src/components/home/WhatWeDo/WhatWeDo.jsx', 'r') as f:
    content = f.read()

content = content.replace('className="what-we-do-card"', 'className="what-we-do-card corner-brackets"')

with open('src/components/home/WhatWeDo/WhatWeDo.jsx', 'w') as f:
    f.write(content)
