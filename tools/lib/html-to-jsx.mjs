import { parseFragment } from 'parse5';

const ATTR = {
  class: 'className', for: 'htmlFor', tabindex: 'tabIndex', readonly: 'readOnly', maxlength: 'maxLength',
  minlength: 'minLength', autocomplete: 'autoComplete', autofocus: 'autoFocus', colspan: 'colSpan', rowspan: 'rowSpan',
  crossorigin: 'crossOrigin', 'xlink:href': 'xlinkHref', 'accept-charset': 'acceptCharset', enctype: 'encType',
  novalidate: 'noValidate', contenteditable: 'contentEditable', frameborder: 'frameBorder',
  allowfullscreen: 'allowFullScreen', playsinline: 'playsInline', srcset: 'srcSet', fetchpriority: 'fetchPriority',
  inputmode: 'inputMode', enterkeyhint: 'enterKeyHint', datetime: 'dateTime', usemap: 'useMap', srclang: 'srcLang',
  cellpadding: 'cellPadding', cellspacing: 'cellSpacing', spellcheck: 'spellCheck', charset: 'charSet',
  nomodule: 'noModule', formaction: 'formAction', formmethod: 'formMethod', formtarget: 'formTarget',
};
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const DROP = new Set(['script', 'style', 'noscript', 'template']);
const BOOLEAN = new Set(['disabled', 'checked', 'readonly', 'required', 'hidden', 'multiple', 'selected', 'autofocus', 'novalidate', 'open', 'autoplay', 'controls', 'loop', 'muted', 'playsinline', 'allowfullscreen', 'async', 'defer']);

// React types these attributes as numbers.
const NUMERIC = new Set(['tabindex', 'maxlength', 'minlength', 'colspan', 'rowspan', 'rows', 'cols', 'size', 'span']);

const camel = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

function styleObj(str) {
  const entries = str
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((decl) => {
      const i = decl.indexOf(':');
      const k = decl.slice(0, i).trim();
      const v = decl.slice(i + 1).trim();
      return [k.startsWith('--') ? k : camel(k), v];
    });
  return `{{ ${entries.map(([k, v]) => `${JSON.stringify(k)}: ${JSON.stringify(v)}`).join(', ')} }}`;
}

function attrValue(v) {
  return /["\\\n&{}<>]/.test(v) ? `{${JSON.stringify(v)}}` : `"${v}"`;
}

function prop(k, v, tag, svg) {
  if (k.startsWith('on')) return null;
  if (k === 'style') return v.trim().replace(/;/g, '').trim() ? `style=${styleObj(v)}` : null;
  let name = ATTR[k] ?? k;
  if ((tag === 'input' || tag === 'textarea' || tag === 'select') && k === 'value') name = 'defaultValue';
  if (tag === 'input' && k === 'checked') name = 'defaultChecked';
  if (svg && !ATTR[k] && !k.startsWith('aria-') && !k.startsWith('data-') && k.includes('-')) name = camel(k);
  if (BOOLEAN.has(k) && v === '') return name;
  if (NUMERIC.has(k) && /^-?\d+$/.test(v)) return `${name}={${v}}`;
  return `${name}=${attrValue(v)}`;
}

function text(value) {
  // Whitespace-only nodes: a single-line gap between inline nodes is a real space; newline gaps are formatting.
  if (!value.trim()) return value.includes('\n') ? '' : '{" "}';
  return /[{}<>&'"]/.test(value) || /^\s|\s$/.test(value) || value.includes('\n') ? `{${JSON.stringify(value)}}` : value;
}

function image(a, st, resolveImage) {
  const alt = a.alt ?? '';
  const cls = a.class ?? '';
  const hit = resolveImage({ src: a.src ?? '', alt });
  const w = Number(a.width);
  const h = Number(a.height);
  if (hit) {
    st.image = true;
    const size = w && h ? `width={${w}} height={${h}}` : 'fill sizes="100vw"';
    return `<Image src=${attrValue(hit)} alt=${attrValue(alt)} ${size} className=${attrValue(cls)} />`;
  }
  st.placeholder = true;
  const ratio = w && h ? ` ratio={${+(w / h).toFixed(3)}}` : '';
  return `<Placeholder label=${attrValue(alt || 'Image')}${ratio} className=${attrValue(cls)} />`;
}

// Converts sibling nodes. Comments are dropped, and text separated only by comments is merged so that
// `a <!-- -->b` keeps exactly one space between the words.
function children(nodes, st, inSvg, resolveImage) {
  const parts = [];
  let pending = null;
  const flush = () => {
    if (pending !== null) parts.push(text(pending));
    pending = null;
  };
  for (const c of nodes) {
    if (c.nodeName === '#comment') continue;
    if (c.nodeName === '#text') {
      pending = pending === null ? c.value : /\s$/.test(pending) ? pending + c.value.replace(/^[^\S\n]+/, '') : pending + c.value;
      continue;
    }
    flush();
    parts.push(node(c, st, inSvg, resolveImage));
  }
  flush();
  return parts.join('');
}

function node(n, st, inSvg, resolveImage) {
  const tag = n.tagName;
  if (!tag || DROP.has(tag)) return '';
  const attrs = Object.fromEntries(n.attrs.map((a) => [a.name, a.value]));
  if (tag === 'img') return image(attrs, st, resolveImage);
  const svg = inSvg || tag === 'svg';
  const kids = children(n.childNodes, st, svg, resolveImage);
  let name = tag;
  const href = attrs.href;
  if (tag === 'a' && href && href.startsWith('/') && !href.startsWith('//')) {
    name = 'Link';
    st.link = true;
  }
  const props = Object.entries(attrs).map(([k, v]) => prop(k, v, tag, svg)).filter(Boolean);
  const open = `<${name}${props.length ? ' ' + props.join(' ') : ''}`;
  return VOID.has(tag) ? `${open} />` : `${open}>${kids}</${name}>`;
}

export function htmlToJsx(html, { resolveImage = () => null } = {}) {
  const st = { link: false, placeholder: false, image: false };
  const frag = parseFragment(html);
  const jsx = children(frag.childNodes, st, false, resolveImage);
  return { jsx, usesLink: st.link, usesPlaceholder: st.placeholder, usesImage: st.image };
}
