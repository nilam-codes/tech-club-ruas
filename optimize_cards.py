import re

def optimize_card(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Replace state with direct DOM manipulation
    # Remove const [style, setStyle] = useState({});
    content = re.sub(r'const \[style,\s*setStyle\] = useState\(\{\}\);\n', '', content)
    
    # Update handleMouseMove
    old_move = r'''const handleMouseMove = \(e\) => \{
    if \(\!cardRef\.current\) return;
    const rect = cardRef\.current\.getBoundingClientRect\(\);
    const x = e\.clientX - rect\.left;
    const y = e\.clientY - rect\.top;
    
    const centerX = rect\.width / 2;
    const centerY = rect\.height / 2;
    
    const rotateX = \(\(y - centerY\) / centerY\) \* (.*?);
    const rotateY = \(\(x - centerX\) / centerX\) \* (.*?);

    setStyle\(\{
      transform: perspective\(1000px\) rotateX\(\$\{rotateX\}deg\) rotateY\(\$\{rotateY\}deg\) scale3d\((.*?)\),
      transition: 'none'
    \}\);
  \};'''

    new_move = r'''const handleMouseMove = (e) => {
    if (!cardRef.current || !window.matchMedia('(hover: hover)').matches) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * \1;
    const rotateY = ((x - centerX) / centerX) * \2;

    requestAnimationFrame(() => {
      if (cardRef.current) {
        cardRef.current.style.transform = perspective(1000px) rotateX(deg) rotateY(deg) scale3d(\3);
        cardRef.current.style.transition = 'none';
      }
    });
  };'''
    
    content = re.sub(old_move, new_move, content)
    
    # Update handleMouseLeave
    old_leave = r'''const handleMouseLeave = \(\) => \{
    setStyle\(\{
      transform: 'perspective\(1000px\) rotateX\(0deg\) rotateY\(0deg\) scale3d\(1, 1, 1\)',
      transition: 'transform 0\.5s cubic-bezier\(0\.2, 0\.8, 0\.2, 1\)'
    \}\);
  \};'''

    new_leave = r'''const handleMouseLeave = () => {
    if (!cardRef.current || !window.matchMedia('(hover: hover)').matches) return;
    requestAnimationFrame(() => {
      if (cardRef.current) {
        cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        cardRef.current.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
      }
    });
  };'''

    content = re.sub(old_leave, new_leave, content)
    
    # Remove style={style}
    content = content.replace('style={style}', '')

    with open(filepath, 'w') as f:
        f.write(content)

optimize_card('src/components/home/WhatWeDo/WhatWeDo.jsx')
optimize_card('src/components/home/FeaturedEvents/FeaturedEvents.jsx')
optimize_card('src/components/home/TeamSpotlight/TeamSpotlight.jsx')
