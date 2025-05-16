import { Block } from './note-editor';

export const exportToMarkdown = (blocks: Block[]): string => {
  return blocks.map(block => {
    switch (block.type) {
      case 'heading1':
        return `# ${block.content}`;
      case 'heading2':
        return `## ${block.content}`;
      case 'list':
        return `${'  '.repeat(block.level || 0)}- ${block.content}`;
      case 'checkbox':
        return `${'  '.repeat(block.level || 0)}- [ ] ${block.content}`;
      case 'code':
        return `\`\`\`\n${block.content}\n\`\`\``;
      case 'link':
        return `[${block.content}](${block.content})`;
      default:
        return block.content;
    }
  }).join('\n');
};
