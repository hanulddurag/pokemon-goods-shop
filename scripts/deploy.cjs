const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building application for GitHub Pages...');
execSync('npm run build', { stdio: 'inherit' });

const nojekyllPath = path.join(__dirname, '..', 'dist', '.nojekyll');
fs.writeFileSync(nojekyllPath, '');
console.log('✅ Created .nojekyll');

const distGitDir = path.join(__dirname, '..', 'dist', '.git');
if (!fs.existsSync(distGitDir)) {
  execSync('git -C dist init', { stdio: 'inherit' });
  execSync('git -C dist checkout -b gh-pages', { stdio: 'inherit' });
  execSync('git -C dist remote add origin https://github.com/hanulddurag/pokemon-goods-shop.git', { stdio: 'inherit' });
}

execSync('git -C dist add -A', { stdio: 'inherit' });
try {
  execSync('git -C dist commit -m "deploy: Update GitHub Pages build"', { stdio: 'inherit' });
} catch (e) {
  console.log('No changes to commit in dist.');
}

console.log('📤 Pushing to gh-pages branch...');
execSync('git -C dist push -f origin gh-pages', { stdio: 'inherit' });

console.log('🎉 Successfully deployed to GitHub Pages!');
console.log('🌐 Live URL: https://hanulddurag.github.io/pokemon-goods-shop/');
