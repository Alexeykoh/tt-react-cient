import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Text, Heading1 } from "lucide-react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { NoteBlockV2 } from "./note-block-v2";

export type BlockType = "text" | "heading1";

export interface BlockV2 {
  id: string;
  type: BlockType;
  content: string;
  parentIds: Array<string> | null;
  children: Array<BlockV2>;
  isFocused: boolean;
}

export function NotesEditorV2() {
  const [blocks, setBlocks] = useState<BlockV2[]>([
    {
      id: uuidv4(),
      type: "heading1",
      content: "Мои заметки",
      parentIds: null,
      children: [],
      isFocused: false,
    },
    {
      id: uuidv4(),
      type: "text",
      content: "Начните писать здесь...",
      parentIds: null,
      children: [],
      isFocused: true,
    },
  ]);

  function addBlock(blockType: BlockType) {
    const newBlock: BlockV2 = {
      id: uuidv4(),
      type: blockType,
      content: "",
      parentIds: null,
      children: [],
      isFocused: true,
    };

    setBlocks(prev => {
      // Снимаем фокус со всех блоков
      const updatedBlocks = prev.map(block => ({
        ...block,
        isFocused: false,
      }));
      return [...updatedBlocks, newBlock];
    });
  }

  function editItem(id: string, parentIds: Array<string>, value: string) {
    setBlocks(prev => updateBlockContent(prev, id, parentIds, value));
  }

  function updateBlockContent(
    blocks: BlockV2[],
    id: string,
    parentIds: string[] | null,
    value: string
  ): BlockV2[] {
    return blocks.map(block => {
      if (block.id === id && JSON.stringify(block.parentIds) === JSON.stringify(parentIds)) {
        return { ...block, content: value };
      }
      if (block.children.length > 0) {
        return {
          ...block,
          children: updateBlockContent(block.children, id, parentIds, value),
        };
      }
      return block;
    });
  }

  function onEnter(id: string, parentIds: Array<string>, referenceType: BlockType) {
    const newBlock: BlockV2 = {
      id: uuidv4(),
      type: referenceType,
      content: "",
      parentIds: [...parentIds],
      children: [],
      isFocused: true,
    };

    setBlocks(prev => {
      const newBlocks = [...prev];
      const index = newBlocks.findIndex(block => block.id === id);
      
      if (index !== -1) {
        // Снимаем фокус со всех блоков
        const updatedBlocks = newBlocks.map(block => ({
          ...block,
          isFocused: false,
        }));
        
        // Вставляем новый блок
        updatedBlocks.splice(index + 1, 0, newBlock);
        return updatedBlocks;
      }
      return prev;
    });
  }

  function onTab(id: string, parentIds: Array<string>) {
    setBlocks(prev => {
      // Находим блок для вложенности
      const blockIndex = prev.findIndex(block => block.id === id);
      if (blockIndex === -1 || blockIndex === 0) return prev;

      const blockToNest = prev[blockIndex];
      const previousBlock = prev[blockIndex - 1];

      // Создаем новый массив без перемещаемого блока
      const newBlocks = prev.filter((_, i) => i !== blockIndex);

      // Добавляем блок как child к предыдущему
      return newBlocks.map((block, i) => {
        if (i === blockIndex - 1) {
          return {
            ...block,
            children: [...block.children, {
              ...blockToNest,
              parentIds: block.parentIds ? [...block.parentIds, block.id] : [block.id],
              isFocused: true,
            }],
          };
        }
        return {
          ...block,
          isFocused: false,
        };
      });
    });
  }

  function onDelete(id: string, parentIds: Array<string>) {
    setBlocks(prev => {
      // 1. Удаляем блок
      const newBlocks = removeBlock(prev, id);
      
      // 2. Находим предыдущий блок для фокуса
      const flatBlocks = flattenBlocks(newBlocks);
      const deletedIndex = flatBlocks.findIndex(b => b.id === id);
      const focusIndex = Math.max(0, deletedIndex - 1);
      
      // 3. Обновляем фокус
      return newBlocks.map(block => ({
        ...updateFocus(block, flatBlocks[focusIndex]?.id),
      }));
    });
  }

  function removeBlock(blocks: BlockV2[], id: string): BlockV2[] {
    return blocks
      .filter(block => block.id !== id)
      .map(block => ({
        ...block,
        children: removeBlock(block.children, id),
      }));
  }

  function updateFocus(block: BlockV2, focusId?: string): BlockV2 {
    return {
      ...block,
      isFocused: block.id === focusId,
      children: block.children.map(child => updateFocus(child, focusId)),
    };
  }

  function flattenBlocks(blocks: BlockV2[]): BlockV2[] {
    return blocks.reduce<BlockV2[]>((acc, block) => {
      return [...acc, block, ...flattenBlocks(block.children)];
    }, []);
  }

  return (
    <div className="space-y-2">
      {blocks.map(block => (
        <NoteBlockV2
          key={block.id}
          block={block}
          onChange={editItem}
          onEnter={onEnter}
          onDelete={onDelete}
          onTab={onTab}
        />
      ))}
      <div className="flex justify-end mt-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
              <Plus className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => addBlock("text")}>
              <Text className="mr-2 h-3.5 w-3.5" />
              <span>Текст</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => addBlock("heading1")}>
              <Heading1 className="mr-2 h-3.5 w-3.5" />
              <span>Заголовок 1</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}