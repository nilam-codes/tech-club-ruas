import re

with open('src/pages/Home/HomePage.jsx', 'r') as f:
    content = f.read()

content = content.replace("import SocialCTA from '../../components/home/SocialCTA/SocialCTA';", "import SocialCTA from '../../components/home/SocialCTA/SocialCTA';\nimport BuiltByClub from '../../components/home/BuiltByClub/BuiltByClub';")

content = content.replace("<SocialCTA />", "<BuiltByClub />\n      <SocialCTA />")

with open('src/pages/Home/HomePage.jsx', 'w') as f:
    f.write(content)
