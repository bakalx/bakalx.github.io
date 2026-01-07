#!/usr/bin/env python3
"""Simple WCAG contrast checker for key site colors."""

from math import pow

# sRGB to linear
def srgb_to_lin(c):
    c = c / 255.0
    if c <= 0.03928:
        return c / 12.92
    return pow((c + 0.055) / 1.055, 2.4)

def rel_luminance(rgb):
    r, g, b = rgb
    return 0.2126 * srgb_to_lin(r) + 0.7152 * srgb_to_lin(g) + 0.0722 * srgb_to_lin(b)

def contrast_ratio(a, b):
    L1 = rel_luminance(a)
    L2 = rel_luminance(b)
    L1, L2 = max(L1, L2), min(L1, L2)
    return (L1 + 0.05) / (L2 + 0.05)

# Blend rgba over a background rgb
def blend_rgba(fg_rgba, bg_rgb):
    fr, fg, fb, fa = fg_rgba
    br, bg, bb = bg_rgb
    r = int(round((fr * fa) + (br * (1 - fa))))
    g = int(round((fg * fa) + (bg * (1 - fa))))
    b = int(round((fb * fa) + (bb * (1 - fa))))
    return (r, g, b)

pairs = [
    ("text-primary / bg-main (light)", (28,30,33), (240,242,245)),
    ("nav-text / nav-bg", (255,255,255), (26,35,126)),
    ("white / accent", (255,255,255), (191,54,12)),
    ("price-tag (accent) / card-bg", (191,54,12), blend_rgba((255,255,255,0.8),(240,242,245))),
    ("hero white / hero blue1", (255,255,255), (26,35,126)),
    ("hero white / hero blue2", (255,255,255), (63,81,181)),
    ("link (dark) / bg-main (dark)", (96,165,250), (15,23,42)),
    ("text (dark theme) / bg-main (dark)", (241,245,249), (15,23,42)),
    ("text (dark) / card-bg (dark composite)", (241,245,249), blend_rgba((30,41,59,0.7),(15,23,42))),
]

print("Contrast check (target >= 4.5:1):\n")
for name, fg, bg in pairs:
    ratio = contrast_ratio(fg, bg)
    ok = ratio >= 4.5
    print(f"{name}: {ratio:.2f}:1 {'PASS' if ok else 'FAIL'}")

# Exit with non-zero if any fail
fails = [contrast_ratio(fg,bg) < 4.5 for _,fg,bg in pairs]
if any(fails):
    raise SystemExit(1)
print("All checked pairs meet 4.5:1")
