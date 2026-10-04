import re

with open('src/components/home/WhatWeDo/WhatWeDo.jsx', 'r') as f:
    content = f.read()

content = content.replace('{activity.num}', '// {activity.num}')

with open('src/components/home/WhatWeDo/WhatWeDo.jsx', 'w') as f:
    f.write(content)
