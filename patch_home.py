import re

with open('src/pages/Home/HomePage.jsx', 'r') as f:
    content = f.read()

content = content.replace("import Hero from '../../components/home/Hero/Hero';", "import Hero from '../../components/home/Hero/Hero';\nimport CuriositySection from '../../components/home/CuriositySection/CuriositySection';")

content = content.replace("      <Hero onNavigate={onNavigate} />", "      <Hero onNavigate={onNavigate} />\n\n      <CuriositySection />")

with open('src/pages/Home/HomePage.jsx', 'w') as f:
    f.write(content)
