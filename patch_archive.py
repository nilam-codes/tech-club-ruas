import re

with open('src/pages/Archive/ArchiveDetailPage.jsx', 'r') as f:
    content = f.read()

# Add imports
imports = '''import MediaLightbox from '../../components/common/MediaLightbox/MediaLightbox';
import FadeInSection from '../../components/common/FadeInSection/FadeInSection';
import HorizontalGallery from '../../components/common/HorizontalGallery/HorizontalGallery';'''
content = content.replace("import MediaLightbox from '../../components/common/MediaLightbox/MediaLightbox';", imports)

# Wrap EVENT HEADER
content = content.replace("{/* 1. EVENT HEADER */}", "{/* 1. EVENT HEADER */}\n        <FadeInSection>")
content = content.replace("{/* 2. WINNER */}", "</FadeInSection>\n\n        {/* 2. WINNER */}")

# Wrap WINNER
content = content.replace("{archive.winner_team_name && (", "{archive.winner_team_name && (\n          <FadeInSection delay={0.1}>")
content = content.replace("{/* 3. FINAL SCOREBOARD */}", "</FadeInSection>\n        )}\n\n        {/* 3. FINAL SCOREBOARD */}")

# Wrap ROUNDS
round_wrap_start = '''{round.subs.map(sub => (
                <div key={sub.id} style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '12px', background: 'rgba(255,255,255,0.02)' }}>'''
round_wrap_end = '''{renderThumbnail(sub.image_url, 'Submission')}</div>
                  <div className="meta-label">TEAM: {sub.team_name}</div>
                </div>
              ))}'''

content = content.replace("{round.subs.map(sub => (", "{round.subs.map((sub, idx) => (\n                <FadeInSection delay={idx * 0.1} key={sub.id}>")
content = content.replace("TEAM: {sub.team_name}</div>\n                </div>\n              ))}", "TEAM: {sub.team_name}</div>\n                </div>\n                </FadeInSection>\n              ))}")


# Replace GALLERY
gallery_pattern = r'\{\/\* 5\. EVENT GALLERY \*\/\}[\s\S]*?(?=\s*<\/div>\s*\{lightboxUrl)'
new_gallery = '''{/* 5. EVENT GALLERY */}
        {gallery.length > 0 && (
          <FadeInSection delay={0.2}>
            <HorizontalGallery gallery={gallery} renderThumbnail={renderThumbnail} />
          </FadeInSection>
        )}'''
content = re.sub(gallery_pattern, new_gallery, content)

with open('src/pages/Archive/ArchiveDetailPage.jsx', 'w') as f:
    f.write(content)
