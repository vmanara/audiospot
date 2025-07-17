// Extended markdown parsing utilities
class MarkdownParser {
  constructor() {
    this.initializeMarked();
  }

  initializeMarked() {
    if (typeof marked === 'undefined') {
      console.error('Marked.js is not loaded');
      return;
    }

    // Configure marked options
    marked.setOptions({
      highlight: function(code, lang) {
        if (lang && hljs && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(code, { language: lang }).value;
          } catch (err) {
            console.error('Highlight.js error:', err);
          }
        }
        return code;
      },
      langPrefix: 'hljs language-',
      breaks: true,
      gfm: true,
      sanitize: false,
      smartLists: true,
      smartypants: true
    });

    // Custom renderer for enhanced formatting
    const renderer = new marked.Renderer();
    
    // Custom image renderer with lazy loading
    renderer.image = function(href, title, text) {
      const titleAttr = title ? ` title="${title}"` : '';
      return `<img src="${href}" alt="${text}"${titleAttr} loading="lazy" class="post-image">`;
    };

    // Custom link renderer with external link handling
    renderer.link = function(href, title, text) {
      const titleAttr = title ? ` title="${title}"` : '';
      const isExternal = href.startsWith('http') && !href.includes(window.location.hostname);
      const externalAttrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${href}"${titleAttr}${externalAttrs}>${text}</a>`;
    };

    // Custom table renderer
    renderer.table = function(header, body) {
      return `<div class="table-wrapper"><table class="post-table">${header}${body}</table></div>`;
    };

    // Custom blockquote renderer
    renderer.blockquote = function(quote) {
      return `<blockquote class="post-blockquote">${quote}</blockquote>`;
    };

    // Custom code renderer
    renderer.code = function(code, infostring, escaped) {
      const lang = (infostring || '').match(/\S*/)[0];
      if (lang) {
        return `<pre class="code-block"><code class="language-${lang}">${escaped ? code : this.options.highlight(code, lang)}</code></pre>`;
      }
      return `<pre class="code-block"><code>${escaped ? code : code}</code></pre>`;
    };

    marked.setOptions({ renderer });
  }

  parse(markdown) {
    if (typeof marked === 'undefined') {
      console.error('Marked.js is not available');
      return '<p>Erro: Não foi possível processar o conteúdo.</p>';
    }

    try {
      return marked.parse(markdown);
    } catch (error) {
      console.error('Error parsing markdown:', error);
      return '<p>Erro ao processar o conteúdo do post.</p>';
    }
  }

  // Extract metadata from markdown frontmatter
  extractFrontmatter(markdown) {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
    const match = markdown.match(frontmatterRegex);
    
    if (!match) {
      return { metadata: {}, content: markdown };
    }

    const frontmatter = match[1];
    const content = markdown.slice(match[0].length);
    const metadata = {};

    // Parse YAML-like frontmatter
    frontmatter.split('\n').forEach(line => {
      const colonIndex = line.indexOf(':');
      if (colonIndex !== -1) {
        const key = line.slice(0, colonIndex).trim();
        const value = line.slice(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
        metadata[key] = value;
      }
    });

    return { metadata, content };
  }

  // Generate table of contents
  generateTOC(markdown) {
    const headings = [];
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    let match;

    while ((match = headingRegex.exec(markdown)) !== null) {
      const level = match[1].length;
      const text = match[2];
      const slug = this.slugify(text);
      headings.push({ level, text, slug });
    }

    if (headings.length === 0) {
      return '';
    }

    let toc = '<nav class="table-of-contents"><h4>Índice</h4><ul>';
    let currentLevel = 1;

    headings.forEach(heading => {
      if (heading.level > currentLevel) {
        toc += '<ul>'.repeat(heading.level - currentLevel);
      } else if (heading.level < currentLevel) {
        toc += '</ul>'.repeat(currentLevel - heading.level);
      }
      toc += `<li><a href="#${heading.slug}">${heading.text}</a></li>`;
      currentLevel = heading.level;
    });

    toc += '</ul>'.repeat(currentLevel) + '</nav>';
    return toc;
  }

  // Create URL-friendly slug
  slugify(text) {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }

  // Add anchor links to headings
  addHeadingAnchors(html) {
    return html.replace(
      /<h([1-6])([^>]*)>([^<]+)<\/h[1-6]>/g,
      (match, level, attrs, text) => {
        const slug = this.slugify(text);
        return `<h${level}${attrs} id="${slug}">
          <a href="#${slug}" class="heading-anchor" aria-hidden="true">#</a>
          ${text}
        </h${level}>`;
      }
    );
  }

  // Estimate reading time
  estimateReadingTime(text) {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes === 1 ? '1 minuto' : `${minutes} minutos`;
  }

  // Process full markdown with all enhancements
  processMarkdown(markdown) {
    const { metadata, content } = this.extractFrontmatter(markdown);
    const toc = this.generateTOC(content);
    const html = this.parse(content);
    const htmlWithAnchors = this.addHeadingAnchors(html);
    const readingTime = this.estimateReadingTime(content);

    return {
      metadata,
      toc,
      html: htmlWithAnchors,
      readingTime
    };
  }
}

// Initialize parser when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.markdownParser = new MarkdownParser();
});
