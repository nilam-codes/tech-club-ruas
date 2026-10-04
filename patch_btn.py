import re

with open('src/components/common/Button/Button.css', 'r') as f:
    content = f.read()

content = content.replace("transition: all var(--transition-fast);", "transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), background-color var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast);")

# Add btn:hover
content += '''
@media (hover: hover) {
  .btn:hover {
    transform: scale(1.02) translateY(-1px);
  }
}
@media (prefers-reduced-motion: reduce) {
  .btn:hover {
    transform: none;
  }
}
'''

with open('src/components/common/Button/Button.css', 'w') as f:
    f.write(content)
