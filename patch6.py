import re

with open('src/pages/Admin/AdminArchivePanel.jsx', 'r') as f:
    content = f.read()

# Update handleDirectReplace folder logic
repl_func_pattern = r'if \(mediaTarget\.media_type === \'winner_photo\'\) folder = \'winner\';'
repl_func_new = '''if (mediaTarget.media_type === 'winner_photo') folder = 'winner';
      if (mediaTarget.media_type === 'round_submission') folder = 'submissions';'''
content = content.replace(repl_func_pattern, repl_func_new)

# Remove the {!m.media_type.startsWith('round') && ( ... )} condition around REPLACE button
btn_pattern = r'\{\!m\.media_type\.startsWith\(\'round\'\) && \(\s*<label([\s\S]*?)</label>\s*\)\}'
btn_new = r'<label\1</label>'
content = re.sub(btn_pattern, btn_new, content)

with open('src/pages/Admin/AdminArchivePanel.jsx', 'w') as f:
    f.write(content)
