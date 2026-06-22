const fs = require('fs');
const lines = fs.readFileSync('C:/Users/Lamont/.gemini/antigravity/brain/68c6e3d5-855b-4a62-bb9f-be5fda35eba9/.system_generated/logs/transcript.jsonl', 'utf8').split('\n');
for (let l of lines) {
  if (l.includes('USER_INPUT') && l.includes('When I gave you the updated code for the')) {
    const content = JSON.parse(l).content;
    const startIdx = content.indexOf('```tsx') + 6;
    const endIdx = content.indexOf('```', startIdx);
    const codeBlock = content.substring(startIdx, endIdx).trim();
    fs.writeFileSync('apps/web/src/pages/nil/ProposalBuilder.tsx', codeBlock);
    console.log('Successfully restored ' + codeBlock.length + ' bytes to ProposalBuilder.tsx');
    break;
  }
}
