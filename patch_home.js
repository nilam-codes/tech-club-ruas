const fs = require('fs');
let content = fs.readFileSync('src/pages/Home/HomePage.jsx', 'utf8');

const target = \      <WhatWeDo />\;
const replacement = \      {/* WINNER OF OUR FIRST EVENT */}
      <WinnerSection />

      <WhatWeDo />\;
content = content.replace(target, replacement);

fs.writeFileSync('src/pages/Home/HomePage.jsx', content);
