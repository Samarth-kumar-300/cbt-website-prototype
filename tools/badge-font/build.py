"""
Builds components/pages/pricing/sections/fonts/google-play-badge.woff2 from the Figma "Google Play" badge.

The lettering in that badge ("GET IT ON" and "Google Play") is outlined artwork, not an installable
typeface. This script splits the outlines into glyphs and packs them into a tiny font in which the
exact strings map to the exact Figma shapes through the `liga` feature:

    "Google Play" -> gplay      "GET IT ON" -> getiton

So the page keeps live text (selectable, searchable) and gets Figma's own letterforms. Sizing: the font
is drawn at 100 font units per Figma unit and the UPM is 1000, so `font-size: 10 Figma units` is 1:1.
Ligatures turn off when letter-spacing is not 0, so do not letter-space this text.

Usage (needs fonttools + brotli):  python3 tools/badge-font/build.py
Source: tools/badge-font/google-play.svg, exported from DS-CBT, node "Store=Google Play, Style=Brand, Size=md".
"""
import os, re
from fontTools.feaLib.builder import addOpenTypeFeaturesFromString
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.cu2quPen import Cu2QuPen
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.svgLib.path import parse_path

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', '..', 'components', 'pages', 'pricing', 'sections', 'fonts', 'google-play-badge.woff2')
K = 100                    # font units per Figma unit
UPM = 1000                 # => font-size 10 Figma units is 1:1
WORDMARK_BASELINE = 30.0   # y of the flat letter bottoms in the Figma frame
SMALL_BASELINE = 13.0

svg = open(os.path.join(HERE, 'google-play.svg')).read()
paths = re.findall(r'<path d="([^"]+)" fill="white"', svg)  # [0] = Google Play, [1] = GET IT ON


def contours(d):
    pen = RecordingPen(); parse_path(d, pen)
    out, cur = [], []
    for op, args in pen.value:
        cur.append((op, args))
        if op in ('closePath', 'endPath'):
            out.append(cur); cur = []
    return out


def bounds_of(c):
    rp = RecordingPen(); rp.value = c
    bp = BoundsPen(None); rp.replay(bp); return bp.bounds


def glyph_groups(d):
    items = [(bounds_of(c), c) for c in contours(d)]
    inside = lambda a, b: a != b and a[0] >= b[0] - .01 and a[1] >= b[1] - .01 and a[2] <= b[2] + .01 and a[3] <= b[3] + .01
    outers = [i for i, (b, _) in enumerate(items) if not any(inside(b, o[0]) for j, o in enumerate(items) if j != i)]
    groups = {i: [i] for i in outers}
    for k, (b, _) in enumerate(items):
        if k not in outers:
            groups[min((i for i in outers if inside(b, items[i][0])), key=lambda i: items[i][0][2] - items[i][0][0])].append(k)
    return [{'bounds': items[i][0], 'contours': [items[k][1] for k in groups[i]]} for i in sorted(groups, key=lambda i: items[i][0][0])]


def draw(cs, x0, baseline, pen):
    """Draw SVG contours into a font glyph: shift to x0, put `baseline` at y=0, flip y, scale by K."""
    tp = TransformPen(Cu2QuPen(pen, max_err=2.0, reverse_direction=True), (K, 0, 0, -K, -x0 * K, baseline * K))
    for c in cs:
        rp = RecordingPen(); rp.value = c; rp.replay(tp)


def make_glyph(cs, x0, baseline):
    pen = TTGlyphPen(None); draw(cs, x0, baseline, pen); return pen.glyph()


word = glyph_groups(paths[0]); small = glyph_groups(paths[1])
assert len(word) == 10 and len(small) == 7, (len(word), len(small))
WORD_CHARS = list('Google Play'.replace(' ', ''))   # G o o g l e P l a y
SMALL_CHARS = list('GETITON')

glyphs, advance, cmap = {'.notdef': TTGlyphPen(None).glyph()}, {'.notdef': 500}, {}


def add_base(name, ch, group, baseline):
    x0, _, x1, _ = group['bounds']
    glyphs[name] = make_glyph(group['contours'], x0, baseline)
    advance[name] = round((x1 - x0 + 0.8) * K)
    cmap[ord(ch)] = name


# Base glyphs exist only as ligature inputs / fallback; first occurrence wins.
for ch, g in zip(WORD_CHARS, word):
    if ord(ch) not in cmap: add_base(ch, ch, g, WORDMARK_BASELINE)
for ch, g in zip(SMALL_CHARS, small):
    if ord(ch) not in cmap: add_base(ch, ch, g, SMALL_BASELINE)
glyphs['space'] = TTGlyphPen(None).glyph(); advance['space'] = 300; cmap[0x20] = 'space'


def add_whole(name, groups, baseline):
    x0 = groups[0]['bounds'][0]; x1 = max(g['bounds'][2] for g in groups)
    pen = TTGlyphPen(None)
    for g in groups: draw(g['contours'], x0, baseline, pen)
    glyphs[name] = pen.glyph(); advance[name] = round((x1 - x0) * K)


add_whole('gplay', word, WORDMARK_BASELINE)
add_whole('getiton', small, SMALL_BASELINE)

order = ['.notdef', 'space'] + [n for n in glyphs if n not in ('.notdef', 'space', 'gplay', 'getiton')] + ['gplay', 'getiton']
fb = FontBuilder(UPM, isTTF=True)
fb.setupGlyphOrder(order)
fb.setupCharacterMap(cmap)
fb.setupGlyf({n: glyphs[n] for n in order})
fb.setupHorizontalMetrics({n: (advance[n], getattr(glyphs[n], 'xMin', 0) if glyphs[n].numberOfContours else 0) for n in order})
ASC, DESC = 1300, 410  # 12.95 above / 4.08 below the baseline, rounded up
fb.setupHorizontalHeader(ascent=ASC, descent=-DESC, lineGap=0)
fb.setupNameTable({'familyName': 'CBT Google Play Badge', 'styleName': 'Regular'})
fb.setupOS2(version=4, sTypoAscender=ASC, sTypoDescender=-DESC, sTypoLineGap=0, usWinAscent=ASC, usWinDescent=DESC, fsSelection=0x40 | 0x80, achVendID='CBT ')
fb.setupPost()
addOpenTypeFeaturesFromString(fb.font, """
languagesystem DFLT dflt;
feature liga {
  sub G o o g l e space P l a y by gplay;
  sub G E T space I T space O N by getiton;
} liga;
""")
fb.font.flavor = 'woff2'
fb.save(OUT)
print('wrote', os.path.normpath(OUT), os.path.getsize(OUT), 'bytes; ascent', ASC / K, 'descent', DESC / K, '(Figma units)')
