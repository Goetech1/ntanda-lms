const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'frontend/src');

const replacements = [
  { regex: /\bbg-slate-950\b/g, replacement: 'bg-slate-50' },
  { regex: /\bbg-slate-900\b/g, replacement: 'bg-white' },
  { regex: /\bbg-slate-800\b/g, replacement: 'bg-slate-100' },
  { regex: /\bbg-slate-700\b/g, replacement: 'bg-slate-200' },
  { regex: /\bborder-slate-800\b/g, replacement: 'border-slate-200' },
  { regex: /\bborder-slate-700\b/g, replacement: 'border-slate-300' },
  { regex: /\btext-slate-50\b/g, replacement: 'text-slate-900' },
  { regex: /\btext-slate-100\b/g, replacement: 'text-slate-900' },
  { regex: /\btext-slate-200\b/g, replacement: 'text-slate-800' },
  { regex: /\btext-slate-300\b/g, replacement: 'text-slate-700' },
  { regex: /\btext-slate-400\b/g, replacement: 'text-slate-600' },
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.tsx')) {
      // Exclude layouts to manually keep the sidebar dark
      if (fullPath.endsWith('AdminLayout.jsx') || fullPath.endsWith('InstructorLayout.jsx')) {
        continue;
      }

      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;

      for (const { regex, replacement } of replacements) {
        if (regex.test(content)) {
          content = content.replace(regex, replacement);
          modified = true;
        }
      }

      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory(directoryPath);
console.log('Migration complete.');
