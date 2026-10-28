import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { htmlToJsx } from '../../tools/lib/html-to-jsx.mjs';

describe('htmlToJsx', () => {
  it('renames class and for, keeps aria/data', () => {
    const { jsx } = htmlToJsx('<div class="a b" data-x="1" aria-hidden="true"><label for="n">N</label></div>');
    expect(jsx).toContain('className="a b"');
    expect(jsx).toContain('data-x="1"');
    expect(jsx).toContain('aria-hidden="true"');
    expect(jsx).toContain('htmlFor="n"');
  });
  it('converts style strings to objects, keeping custom properties', () => {
    const { jsx } = htmlToJsx('<div style="--faq-heading:#fff; margin-top: 4px"></div>');
    expect(jsx).toContain('style={{ "--faq-heading": "#fff", "marginTop": "4px" }}');
  });
  it('self-closes void elements', () => {
    expect(htmlToJsx('<br><input type="text" value="x">').jsx).toBe('<br /><input type="text" defaultValue="x" />');
  });
  it('drops script, style and comments', () => {
    expect(htmlToJsx('<div>a<script>1</script><!-- c --><style>x{}</style></div>').jsx).toBe('<div>a</div>');
  });
  it('turns internal anchors into Link and leaves external and hash anchors', () => {
    const r = htmlToJsx('<a href="/about">A</a><a href="https://x.com" target="_blank">X</a><a href="#top">T</a>');
    expect(r.jsx).toContain('<Link href="/about">A</Link>');
    expect(r.jsx).toContain('<a href="https://x.com" target="_blank">X</a>');
    expect(r.jsx).toContain('<a href="#top">T</a>');
    expect(r.usesLink).toBe(true);
  });
  it('escapes braces, angle brackets and ampersands in text', () => {
    expect(htmlToJsx('<p>a {b} &lt;c&gt; &amp; d</p>').jsx).toBe('<p>{"a {b} <c> & d"}</p>');
  });
  it('camel-cases hyphenated svg attributes', () => {
    const { jsx } = htmlToJsx('<svg viewBox="0 0 1 1"><path stroke-width="2" fill-rule="evenodd" d="M0 0"></path></svg>');
    expect(jsx).toContain('strokeWidth="2"');
    expect(jsx).toContain('fillRule="evenodd"');
    expect(jsx).toContain('viewBox="0 0 1 1"');
  });
  it('replaces images with Placeholder when no local file matches', () => {
    const r = htmlToJsx('<img src="https://s3/x/Hero.webp" alt="Hero" class="absolute inset-0">');
    expect(r.jsx).toBe('<Placeholder label="Hero" className="absolute inset-0" />');
    expect(r.usesPlaceholder).toBe(true);
  });
  it('uses next/image with fill when a local file matches and no size attrs exist', () => {
    const r = htmlToJsx('<img src="https://s3/x/Hero.webp" alt="Hero" class="absolute inset-0">', { resolveImage: () => '/images/homepage/hero.webp' });
    expect(r.jsx).toBe('<Image src="/images/homepage/hero.webp" alt="Hero" fill sizes="100vw" className="absolute inset-0" />');
    expect(r.usesImage).toBe(true);
  });
  it('emits numeric props as numbers and camel-cases inputmode (TS types)', () => {
    const { jsx } = htmlToJsx('<button tabindex="-1">b</button><textarea rows="5"></textarea><input inputmode="tel">');
    expect(jsx).toContain('tabIndex={-1}');
    expect(jsx).toContain('rows={5}');
    expect(jsx).toContain('inputMode="tel"');
  });
  it('wraps text containing quotes so lint does not flag unescaped entities', () => {
    expect(htmlToJsx("<p>it's</p>").jsx).toBe('<p>{"it\'s"}</p>');
  });
  it('keeps single-line whitespace between inline nodes as a space', () => {
    expect(htmlToJsx('<p><span>a</span> <b>b</b></p>').jsx).toBe('<p><span>a</span>{" "}<b>b</b></p>');
  });
  it('keeps one space when a comment sits between the space and following text', () => {
    expect(htmlToJsx('<span>x</span> <!-- --> y').jsx).toBe('<span>x</span>{" y"}');
    expect(htmlToJsx('<p><span>450+ objectives</span> <!-- -->across 10 areas</p>').jsx).toBe(
      '<p><span>450+ objectives</span>{" across 10 areas"}</p>',
    );
  });
  it('still drops newline-only whitespace between blocks', () => {
    expect(htmlToJsx('<div>\n  <p>a</p>\n  <p>b</p>\n</div>').jsx).toBe('<div><p>a</p><p>b</p></div>');
  });
  it('escapes quotes and backslashes in image attributes', () => {
    const p = htmlToJsx('<img src="a.webp" alt="say &quot;hi&quot; \\ x" class="c">');
    expect(p.jsx).toBe('<Placeholder label={"say \\"hi\\" \\\\ x"} className="c" />');
    const i = htmlToJsx('<img src="a.webp" alt="say &quot;hi&quot;">', { resolveImage: () => '/images/a.webp' });
    expect(i.jsx).toContain('alt={"say \\"hi\\""}');
  });
  it('omits style when it has no declarations', () => {
    expect(htmlToJsx('<div style=" ; "></div>').jsx).toBe('<div></div>');
  });
  it('uses width/height when present and adds ratio to placeholders', () => {
    const a = htmlToJsx('<img src="a.webp" alt="" width="31" height="24" class="q">', { resolveImage: () => '/images/q.webp' });
    expect(a.jsx).toBe('<Image src="/images/q.webp" alt="" width={31} height={24} className="q" />');
    const b = htmlToJsx('<img src="a.webp" alt="Q" width="30" height="20" class="q">');
    expect(b.jsx).toBe('<Placeholder label="Q" ratio={1.5} className="q" />');
  });
  it('keeps word spacing on the real schools/5 and contact-us/1 captures', () => {
    const schools = htmlToJsx(readFileSync('reference/schools/sections/5.html', 'utf8')).jsx;
    expect(schools).toMatch(/450\+ learning objectives<\/span>\{" across 10 skill areas"\}/);
    const contact = htmlToJsx(readFileSync('reference/contact-us/sections/1.html', 'utf8')).jsx;
    expect(contact).toContain('</Link>{" page."}');
  });
});
