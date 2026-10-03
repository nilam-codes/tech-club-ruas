const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

// Add imports
const imports = \import AdminForgotPasswordPage from './pages/Admin/AdminForgotPasswordPage';
import AdminResetPasswordPage from './pages/Admin/AdminResetPasswordPage';\;
content = content.replace(/import AdminLoginPage from '\.\/pages\/Admin\/AdminLoginPage';/, "import AdminLoginPage from './pages/Admin/AdminLoginPage';\\n" + imports);

// Add to validPages list
content = content.replace(/const validPages = \['home', 'about', 'events', 'team', 'contact', 'admin', 'admin\/login', 'past-events'\];/g, "const validPages = ['home', 'about', 'events', 'team', 'contact', 'admin', 'admin/login', 'admin/forgot-password', 'admin/reset-password', 'past-events'];");

// Handle type=recovery for Implicit Flow in initial page load
content = content.replace(/const getInitialPage = \(\) => \{/, "const getInitialPage = () => {\\n    if (window.location.hash.includes('type=recovery')) return 'admin/reset-password';");

// Handle type=recovery in hashchange
content = content.replace(/const handleHashChange = \(\) => \{/, "const handleHashChange = () => {\\n      if (window.location.hash.includes('type=recovery')) {\\n        setActivePage('admin/reset-password');\\n        return;\\n      }");

// Add to routing switch
content = content.replace(/      case 'admin\/login':/, "      case 'admin/forgot-password':\\n        return <AdminForgotPasswordPage onNavigate={navigateToPage} />;\\n      case 'admin/reset-password':\\n        return <AdminResetPasswordPage onNavigate={navigateToPage} />;\\n      case 'admin/login':");

fs.writeFileSync('src/App.jsx', content);
