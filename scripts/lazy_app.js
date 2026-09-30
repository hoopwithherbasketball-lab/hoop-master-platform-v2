import fs from 'fs';

const appTsxPath = 'apps/web/src/App.tsx';
let content = fs.readFileSync(appTsxPath, 'utf8');

// 1. Add Suspense and lazy to react imports
if (!content.includes('import { Suspense, lazy } from \'react\'')) {
  content = "import { Suspense, lazy } from 'react'\nimport { Loader2 } from 'lucide-react'\n" + content;
}

// 2. Find all import statements from './pages/'
const importRegex = /import\s+([A-Za-z0-9_]+)\s+from\s+['"](\.\/pages\/[^'"]+)['"]/g;

let match;
while ((match = importRegex.exec(content)) !== null) {
  const componentName = match[1];
  const importPath = match[2];
  
  // Replace the static import with a lazy import
  content = content.replace(match[0], `const ${componentName} = lazy(() => import('${importPath}'))`);
}

// 3. Create a fallback component
const fallbackStr = `
const Fallback = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <Loader2 className="w-8 h-8 text-[#FF3366] animate-spin" />
  </div>
);
`;

if (!content.includes('const Fallback')) {
  content = content.replace('function PublicLayout', fallbackStr + '\nfunction PublicLayout');
}

// 4. Wrap AppRoutes in Suspense
if (!content.includes('<Suspense fallback={<Fallback />}>')) {
  content = content.replace('<AppRoutes />', '<Suspense fallback={<Fallback />}><AppRoutes /></Suspense>');
}

fs.writeFileSync(appTsxPath, content);
console.log('App.tsx converted to lazy loading!');
