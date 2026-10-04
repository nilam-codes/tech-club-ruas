import re

with open('src/components/home/UpcomingEvent/UpcomingEvent.jsx', 'r') as f:
    content = f.read()

content = content.replace('<span className="section-index-num">02</span>\n          <span className="section-index-slash">/</span>\n          <span className="section-index-cat">UP NEXT</span>', '<span className="section-index-cat">$ ./up-next</span>')
content = content.replace("01 // LIVE EVENT BRIEF", "$ ./live-event-brief")

with open('src/components/home/UpcomingEvent/UpcomingEvent.jsx', 'w') as f:
    f.write(content)
