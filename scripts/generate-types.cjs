const fs = require('fs');
const path = require('path');
const { callMcpTool } = require('./mcp-client.cjs');

async function main() {
  console.log('🔄 Generating TypeScript types from Supabase via MCP...');
  const res = await callMcpTool('generate_typescript_types');
  const typeDef = res.types || res;

  const targetDir = path.join(__dirname, '..', 'src', 'types');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const targetFile = path.join(targetDir, 'supabase.ts');
  fs.writeFileSync(targetFile, typeDef, 'utf8');
  console.log('✨ TypeScript definitions written to:', targetFile);
}

main().catch(err => {
  console.error('Failed to generate types:', err);
  process.exit(1);
});
