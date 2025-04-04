import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NoteBlock } from './note-block';

export interface Block {
  id: string;
  type: 'text' | 'heading1' | 'heading2' | 'list' | 'checkbox' | 'code' | 'link';
  content: string;
  level?: number;
  parentId?: string;
}

export const NotesPageWidget = () => {
  const [blocks, setBlocks] = useState<Block[]>([
    {
      id: uuidv4(),
      type: 'heading1',
      content: 'Мои заметки',
    },
    {
      id: uuidv4(),
      type: 'text',
      content: 'Начните писать здесь...',
    },
  ]);

  const addBlock = (index: number, type: Block['type'] = 'text', parentId?: string) => {
    const newBlock: Block = {
      id: uuidv4(),
      type,
      content: '',
      level: parentId ? (blocks.find(b => b.id === parentId)?.level || 0) + 1 : 0,
      parentId,
    };

    setBlocks((prev) => [
      ...prev.slice(0, index + 1),
      newBlock,
      ...prev.slice(index + 1),
    ]);
  };

  const addNestedBlock = (parentId: string) => {
    const parentIndex = blocks.findIndex(b => b.id === parentId);
    if (parentIndex !== -1) {
      addBlock(parentIndex, 'list', parentId);
    }
  };

  const updateBlock = (id: string, content: string) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === id ? { ...block, content } : block
      )
    );
  };

  const changeBlockType = (id: string, type: Block['type']) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === id ? { ...block, type } : block
      )
    );
  };

  const deleteBlock = (id: string) => {
    const idsToDelete = new Set([id]);
    let found;
    do {
      found = false;
      blocks.forEach(block => {
        if (block.parentId && idsToDelete.has(block.parentId) && !idsToDelete.has(block.id)) {
          idsToDelete.add(block.id);
          found = true;
        }
      });
    } while (found);

    setBlocks((prev) => prev.filter((block) => !idsToDelete.has(block.id)));
  };

  return (
    <div className="w-full mx-auto p-4">
      <div className="space-y-0.5">
        {blocks.map((block) => (
          <NoteBlock
            key={block.id}
            id={block.id}
            type={block.type}
            content={block.content}
            level={block.level}
            onUpdate={updateBlock}
            onChangeType={changeBlockType}
            onDelete={deleteBlock}
            onAddNested={block.type === 'list' ? addNestedBlock : undefined}
          />
        ))}
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="mt-2 px-2 h-8 text-sm"
        onClick={() => addBlock(blocks.length - 1)}
      >
        <Plus className="mr-2 h-3.5 w-3.5" />
        Добавить блок
      </Button>
    </div>
  );
};
