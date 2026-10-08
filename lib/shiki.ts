import { codeToHtml } from 'shiki';

export async function highlightCode(code: string, lang = 'c'): Promise<string> {
  const cleanLang = lang.toLowerCase() === 'cpp' ? 'cpp' : lang.toLowerCase() === 'bash' ? 'bash' : 'c';
  try {
    return await codeToHtml(code.trim(), {
      lang: cleanLang,
      themes: {
        light: 'min-light',
        dark: 'min-dark',
      },
    });
  } catch {
    // Fallback safe escaping if shiki language fails
    const escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return `<pre class="shiki"><code>${escaped}</code></pre>`;
  }
}
