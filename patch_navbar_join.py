import re

with open('src/components/layout/Navbar/Navbar.jsx', 'r') as f:
    content = f.read()

# Remove Join Club from Desktop Actions
desktop_join = r'''          <div className="navbar-actions-desktop">
            <Button 
              variant="signal" 
              size="sm"
              onClick={\(\) => handleLinkClick\('contact'\)}
            >
              Join Club
            </Button>
          </div>'''
content = re.sub(desktop_join, '          <div className="navbar-actions-desktop">\n          </div>', content)

# Remove Join Club from Mobile Actions
mobile_join = r'''            <div className="navbar-mobile-actions">
              <Button 
                variant="signal" 
                className="w-full"
                onClick={\(\) => handleLinkClick\('contact'\)}
              >
                Join Club
              </Button>'''
new_mobile = r'''            <div className="navbar-mobile-actions">'''
content = re.sub(mobile_join, new_mobile, content)

with open('src/components/layout/Navbar/Navbar.jsx', 'w') as f:
    f.write(content)
