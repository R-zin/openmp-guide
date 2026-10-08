const fs = require('fs');
const matter = require('gray-matter');

const dirs = ['content/mpi', 'content/openmp'];
for (const dir of dirs) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'));
  for (const f of files) {
    const fullPath = dir + '/' + f;
    let content = fs.readFileSync(fullPath, 'utf8');

    // Replace unquoted title: ... in frontmatter if it contains colons
    content = content.replace(/^---\s*\n([\s\S]*?)\n---\s*\n/, (match, fm) => {
      const fixedFm = fm.split('\n').map(line => {
        const titleMatch = line.match(/^(\s*title:\s*)(.+)$/);
        if (titleMatch) {
          let val = titleMatch[2].trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            return line;
          }
          if (val.includes(':') || val.includes("'") || val.includes('"') || val.includes('#') || val.includes('&')) {
            val = val.replace(/"/g, '\\"');
            return `${titleMatch[1]}"${val}"`;
          }
        }
        return line;
      }).join('\n');
      return '---\n' + fixedFm + '\n---\n';
    });

    fs.writeFileSync(fullPath, content);
    try {
      matter(content);
      console.log('SUCCESS:', fullPath);
    } catch (e) {
      console.error('STILL FAILING:', fullPath, e.message);
    }
  }
}
