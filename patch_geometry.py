import re

with open('src/components/home/Hero/CuriousGeometry.jsx', 'r') as f:
    content = f.read()

# Update colors
content = content.replace("'rgba(255, 70, 18, '", "'rgba(0, 245, 255, '")
content = content.replace("'rgba(40, 40, 40, '", "'rgba(57, 255, 20, '")

# Subtle glow
glow = '''        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(0, 245, 255, 0.5)';
        ctx.stroke();
        ctx.shadowBlur = 0;'''
content = content.replace("ctx.stroke();", glow)

with open('src/components/home/Hero/CuriousGeometry.jsx', 'w') as f:
    f.write(content)
