import type React from "react";

import { useState, useCallback, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NoteBlock } from "./note-block";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Text,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Code,
  Link,
  Quote,
  SeparatorHorizontal,
  ImageIcon,
  Strikethrough,
  CodeSquare,
} from "lucide-react";

export interface Block {
  id: string;
  type:
    | "text"
    | "heading1"
    | "heading2"
    | "heading3"
    | "list"
    | "ordered-list"
    | "checkbox"
    | "code"
    | "inline-code"
    | "link"
    | "blockquote"
    | "hr"
    | "image"
    | "strikethrough";
  content: string;
  level?: number;
  parentId?: string;
  checked?: boolean;
  orderNumber?: number;
}

interface props {
  updateState: (state: Block[]) => void;
  sendToServer: () => void;
}

export function NotesEditor({ sendToServer }: props) {
  const [blocks, setBlocks] = useState<Block[]>([
    {
      id: uuidv4(),
      type: "heading1",
      content: "Мои заметки",
    },
    {
      id: uuidv4(),
      type: "text",
      content: "Начните писать здесь...",
    },
  ]);
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);
  const [previousBlockId, setPreviousBlockId] = useState<string | null>(null);
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [dragOverInfo, setDragOverInfo] = useState<{
    id: string;
    position: "before" | "after" | "inside";
  } | null>(null);

  const addBlock = (
    index: number,
    type: Block["type"] = "text",
    parentId?: string,
    level?: number
  ) => {
    const newBlock: Block = {
      id: uuidv4(),
      type,
      content: "",
      level:
        level !== undefined
          ? level
          : parentId
            ? (blocks.find((b) => b.id === parentId)?.level || 0) + 1
            : 0,
      parentId,
      checked: type === "checkbox" ? false : undefined,
      orderNumber: type === "ordered-list" ? 1 : undefined,
    };

    setBlocks((prev) => [
      ...prev.slice(0, index + 1),
      newBlock,
      ...prev.slice(index + 1),
    ]);

    // Set the focused block ID
    setFocusedBlockId(newBlock.id);
    return newBlock.id;
  };

  const addNestedBlock = (parentId: string) => {
    const parentIndex = blocks.findIndex((b) => b.id === parentId);
    const parentBlock = blocks[parentIndex];

    if (parentIndex !== -1) {
      return addBlock(
        parentIndex,
        parentBlock.type,
        parentId,
        (parentBlock.level || 0) + 1
      );
    }
    return null;
  };

  // Find the previous block at the same or lower level
  const findPreviousBlock = (index: number, currentLevel: number) => {
    for (let i = index - 1; i >= 0; i--) {
      if ((blocks[i].level || 0) <= currentLevel) {
        return blocks[i];
      }
    }
    return null;
  };

  // Find the next block at the same or lower level
  const findNextBlock = (index: number, currentLevel: number) => {
    for (let i = index + 1; i < blocks.length; i++) {
      if ((blocks[i].level || 0) <= currentLevel) {
        return blocks[i];
      }
    }
    return null;
  };

  // Get all child blocks of a given block
  const getChildBlocks = (blockId: string): Block[] => {
    return blocks.filter((block) => block.parentId === blockId);
  };

  // Get all descendant blocks (children, grandchildren, etc.)
  const getAllDescendants = (blockId: string): Block[] => {
    const directChildren = getChildBlocks(blockId);
    let allDescendants = [...directChildren];

    directChildren.forEach((child) => {
      allDescendants = [...allDescendants, ...getAllDescendants(child.id)];
    });

    return allDescendants;
  };

  // Update order numbers for ordered lists
  const updateOrderNumbers = () => {
    const newBlocks = [...blocks];
    const orderCounters: { [key: string]: number } = {}; // parentId -> counter

    newBlocks.forEach((block) => {
      if (block.type === "ordered-list") {
        const parentId = block.parentId || "root";
        const level = block.level || 0;

        // Reset counter if this is the first item at this level under this parent
        if (!orderCounters[`${parentId}-${level}`]) {
          orderCounters[`${parentId}-${level}`] = 1;
        }

        // Set the order number
        block.orderNumber = orderCounters[`${parentId}-${level}`]++;
      }
    });

    setBlocks(newBlocks);
  };

  // Call updateOrderNumbers whenever blocks change
  useEffect(() => {
    updateOrderNumbers();
  }, [blocks.length]);

  const increaseIndent = (id: string) => {
    const blockIndex = blocks.findIndex((b) => b.id === id);
    if (blockIndex <= 0) return; // Can't indent the first block

    const currentBlock = blocks[blockIndex];
    const currentLevel = currentBlock.level || 0;

    // Find the previous block that could be a parent
    const previousBlock = findPreviousBlock(blockIndex, currentLevel);

    if (!previousBlock) return;

    setBlocks((prev) =>
      prev.map((block) => {
        if (block.id === id) {
          return {
            ...block,
            level: currentLevel + 1,
            parentId: previousBlock.id,
          };
        }
        return block;
      })
    );
  };

  const decreaseIndent = (id: string) => {
    const blockIndex = blocks.findIndex((b) => b.id === id);
    if (blockIndex === -1) return;

    const currentBlock = blocks[blockIndex];
    const currentLevel = currentBlock.level || 0;

    if (currentLevel <= 0) return; // Already at root level

    // Find the parent's parent to set as the new parent
    const parentBlock = blocks.find((b) => b.id === currentBlock.parentId);
    const newParentId = parentBlock?.parentId;

    setBlocks((prev) =>
      prev.map((block) => {
        if (block.id === id) {
          return {
            ...block,
            level: currentLevel - 1,
            parentId: newParentId,
          };
        }
        return block;
      })
    );
  };

  const updateBlock = (id: string, content: string) => {
    setBlocks((prev) =>
      prev.map((block) => (block.id === id ? { ...block, content } : block))
    );
  };

  const toggleCheckbox = (id: string) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === id ? { ...block, checked: !block.checked } : block
      )
    );
  };

  const changeBlockType = (id: string, type: Block["type"]) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === id
          ? {
              ...block,
              type,
              checked: type === "checkbox" ? false : undefined,
              orderNumber: type === "ordered-list" ? 1 : undefined,
            }
          : block
      )
    );
  };

  const deleteBlock = (id: string) => {
    // Find the index of the block to be deleted
    const blockIndex = blocks.findIndex((b) => b.id === id);
    if (blockIndex === -1) return;

    // Find the previous block to focus after deletion
    const prevBlockId = blockIndex > 0 ? blocks[blockIndex - 1].id : null;
    setPreviousBlockId(prevBlockId);

    // Get the block to be deleted
    const blockToDelete = blocks[blockIndex];

    // Find all child blocks (blocks that have this block as a parent)
    const childBlocks = blocks.filter((b) => b.parentId === id);

    // If there are child blocks, we need to handle them
    if (childBlocks.length > 0) {
      // Find the new parent for the child blocks
      const newParentId = blockToDelete.parentId;

      // Update the parent ID for all child blocks
      setBlocks((prev) =>
        prev
          .map((block) => {
            if (block.parentId === id) {
              return {
                ...block,
                parentId: newParentId,
                level: (block.level || 0) - 1,
              };
            }
            return block;
          })
          .filter((block) => block.id !== id)
      );
    } else {
      // No child blocks, just delete the block
      setBlocks((prev) => prev.filter((block) => block.id !== id));
    }
  };

  // Focus the previous block after deletion
  useEffect(() => {
    if (previousBlockId) {
      setFocusedBlockId(previousBlockId);
      setPreviousBlockId(null);
    }
  }, [previousBlockId]);

  const handleEnterKey = (id: string) => {
    const blockIndex = blocks.findIndex((b) => b.id === id);
    if (blockIndex !== -1) {
      const currentBlock = blocks[blockIndex];
      const newBlockId = addBlock(
        blockIndex,
        currentBlock.type,
        currentBlock.parentId,
        currentBlock.level
      );
      const nextBlock = findNextBlock(blockIndex, currentBlock.level || 0);
      if (nextBlock) {
        setFocusedBlockId(nextBlock.id);
      }
      return newBlockId;
    }
    return null;
  };

  // Handle Markdown-like shortcuts for converting block types
  const handleMarkdownShortcut = (id: string, content: string) => {
    const block = blocks.find((b) => b.id === id);
    if (!block) return;

    // Only process if the content has changed and might contain a shortcut
    if (content === block.content) return;

    let newType: Block["type"] | null = null;
    let newContent = content;

    // Check for heading shortcuts
    if (content.startsWith("# ")) {
      newType = "heading1";
      newContent = content.substring(2);
    } else if (content.startsWith("## ")) {
      newType = "heading2";
      newContent = content.substring(3);
    } else if (content.startsWith("### ")) {
      newType = "heading3";
      newContent = content.substring(4);
    }
    // Check for list shortcuts
    else if (content.startsWith("- ")) {
      newType = "list";
      newContent = content.substring(2);
    }
    // Check for ordered list shortcuts
    else if (content.match(/^\d+\.\s/)) {
      newType = "ordered-list";
      newContent = content.replace(/^\d+\.\s/, "");
    }
    // Check for checkbox shortcuts
    else if (content.startsWith("[ ] ") || content.startsWith("- [ ] ")) {
      newType = "checkbox";
      newContent = content.startsWith("[ ] ")
        ? content.substring(4)
        : content.substring(6);
    }
    // Check for code block shortcuts
    else if (content.startsWith("```")) {
      newType = "code";
      newContent = content.substring(3);
    }
    // Check for inline code shortcuts
    else if (content.startsWith("`") && !content.startsWith("``")) {
      newType = "inline-code";
      newContent = content.substring(1);
    }
    // Check for blockquote shortcuts
    else if (content.startsWith("> ")) {
      newType = "blockquote";
      newContent = content.substring(2);
    }
    // Check for horizontal rule shortcuts
    else if (content === "---" || content === "***" || content === "___") {
      newType = "hr";
      newContent = "";
    }
    // Check for link shortcuts
    else if (content.startsWith("http://") || content.startsWith("https://")) {
      newType = "link";
    }
    // Check for image shortcuts
    else if (
      content.startsWith("![") &&
      content.includes("](") &&
      content.endsWith(")")
    ) {
      newType = "image";
      // Extract the URL from ![alt](url)
      const urlMatch = content.match(/!\[.*\]$$(.*)$$/);
      if (urlMatch && urlMatch[1]) {
        newContent = urlMatch[1];
      }
    }
    // Check for strikethrough shortcuts
    else if (content.startsWith("~~") && content.endsWith("~~")) {
      newType = "strikethrough";
      newContent = content.substring(2, content.length - 2);
    }

    // Apply the changes if a shortcut was detected
    if (newType) {
      changeBlockType(id, newType);
      updateBlock(id, newContent);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (id: string) => {
    setDraggedBlockId(id);
  };

  const handleDragEnd = () => {
    setDraggedBlockId(null);
    setDragOverInfo(null);
  };

  const handleDragOver = (
    id: string,
    position: "before" | "after" | "inside"
  ) => {
    if (draggedBlockId === id) return; // Can't drop on itself

    // Check if the target is a descendant of the dragged block
    if (draggedBlockId) {
      const descendants = getAllDescendants(draggedBlockId);
      if (descendants.some((d) => d.id === id)) return; // Can't drop on a descendant
    }

    setDragOverInfo({ id, position });
  };

  const moveBlock = () => {
    if (!draggedBlockId || !dragOverInfo) return;

    const sourceIndex = blocks.findIndex((b) => b.id === draggedBlockId);
    const targetIndex = blocks.findIndex((b) => b.id === dragOverInfo.id);

    if (sourceIndex === -1 || targetIndex === -1) return;

    // Get the dragged block and all its descendants
    const draggedBlock = blocks[sourceIndex];
    const descendants = getAllDescendants(draggedBlockId);
    const allBlocksToMove = [draggedBlock, ...descendants];
    const allBlockIds = allBlocksToMove.map((b) => b.id);

    // Create a copy of blocks without the dragged blocks
    const newBlocks = blocks.filter((b) => !allBlockIds.includes(b.id));

    // Determine the new parent ID and level based on the drop position
    const newParentId =
      dragOverInfo.position === "inside"
        ? dragOverInfo.id
        : blocks[targetIndex].parentId;
    const newLevel =
      dragOverInfo.position === "inside"
        ? (blocks[targetIndex].level || 0) + 1
        : blocks[targetIndex].level || 0;

    // Update the dragged block with new parent and level
    const updatedDraggedBlock = {
      ...draggedBlock,
      parentId: newParentId,
      level: newLevel,
    };

    // Update all descendants with adjusted levels
    const levelDiff = newLevel - (draggedBlock.level || 0);
    const updatedDescendants = descendants.map((d) => ({
      ...d,
      level: (d.level || 0) + levelDiff,
    }));

    // Determine the insertion index
    let insertIndex = targetIndex;
    if (dragOverInfo.position === "after") {
      // If dropping after, find the last descendant of the target block
      const targetDescendants = getAllDescendants(dragOverInfo.id);
      if (targetDescendants.length > 0) {
        const lastDescendantIndex = blocks.findIndex(
          (b) => b.id === targetDescendants[targetDescendants.length - 1].id
        );
        insertIndex =
          lastDescendantIndex > insertIndex ? lastDescendantIndex : insertIndex;
      }
      insertIndex++;
    }

    // Insert the dragged block and its descendants at the appropriate position
    newBlocks.splice(
      insertIndex,
      0,
      updatedDraggedBlock,
      ...updatedDescendants
    );

    setBlocks(newBlocks);
  };

  // Apply the move when drag ends and there's a valid drop target
  useEffect(() => {
    if (!draggedBlockId || !dragOverInfo) return;
    moveBlock();
    setDraggedBlockId(null);
    setDragOverInfo(null);
  }, [draggedBlockId, dragOverInfo]);

  // Convert blocks to Markdown
  const toMarkdown = useCallback(() => {
    let markdown = "";

    // Helper function to get indentation based on level
    const getIndent = (level = 0) => "  ".repeat(level);

    // Process blocks in order
    blocks.forEach((block) => {
      const indent = getIndent(block.level || 0);

      switch (block.type) {
        case "heading1":
          markdown += `${indent}# ${block.content}\n\n`;
          break;
        case "heading2":
          markdown += `${indent}## ${block.content}\n\n`;
          break;
        case "heading3":
          markdown += `${indent}### ${block.content}\n\n`;
          break;
        case "list":
          markdown += `${indent}- ${block.content}\n`;
          break;
        case "ordered-list":
          markdown += `${indent}${block.orderNumber || 1}. ${block.content}\n`;
          break;
        case "checkbox":
          markdown += `${indent}- [${block.checked ? "x" : " "}] ${block.content}\n`;
          break;
        case "code":
          markdown += `${indent}\`\`\`\n${block.content}\n${indent}\`\`\`\n\n`;
          break;
        case "inline-code":
          markdown += `${indent}\`${block.content}\`\n\n`;
          break;
        case "blockquote":
          markdown += `${indent}> ${block.content}\n\n`;
          break;
        case "hr":
          markdown += `${indent}---\n\n`;
          break;
        case "link":
          // If content looks like a URL, format as a link
          if (block.content.match(/^https?:\/\//)) {
            markdown += `${indent}[${block.content}](${block.content})\n\n`;
          } else {
            markdown += `${indent}[${block.content}]()\n\n`;
          }
          break;
        case "image":
          markdown += `${indent}![Image](${block.content})\n\n`;
          break;
        case "strikethrough":
          markdown += `${indent}~~${block.content}~~\n\n`;
          break;
        default: // text
          markdown += `${indent}${block.content}\n\n`;
      }
    });

    return markdown;
  }, [blocks]);

  // Parse Markdown to blocks
  const fromMarkdown = useCallback((markdown: string) => {
    const lines = markdown.split("\n");
    const newBlocks: Block[] = [];
    let currentCodeBlock: Block | null = null;
    const currentParentStack: string[] = []; // Stack to track parent IDs
    let previousLevel = 0;

    lines.forEach((line) => {
      // If we're in a code block
      if (currentCodeBlock) {
        if (line.trim() === "```") {
          // End of code block
          newBlocks.push(currentCodeBlock);
          currentCodeBlock = null;
        } else {
          // Add line to code block content
          currentCodeBlock.content += line + "\n";
        }
        return;
      }

      // Check for code block start
      if (line.trim() === "```") {
        currentCodeBlock = {
          id: uuidv4(),
          type: "code",
          content: "",
        };
        return;
      }

      // Skip empty lines
      if (line.trim() === "") return;

      // Calculate indentation level
      const match = line.match(/^(\s*)/);
      const indentLevel = match ? Math.floor(match[1].length / 2) : 0;

      // Adjust parent stack based on indentation level
      if (indentLevel > previousLevel) {
        // Going deeper, add the last block as parent
        if (newBlocks.length > 0) {
          currentParentStack.push(newBlocks[newBlocks.length - 1].id);
        }
      } else if (indentLevel < previousLevel) {
        // Going back up, remove parents from stack
        for (let i = 0; i < previousLevel - indentLevel; i++) {
          currentParentStack.pop();
        }
      }

      // Get current parent ID
      const parentId =
        currentParentStack.length > 0
          ? currentParentStack[currentParentStack.length - 1]
          : undefined;

      // Update previous level
      previousLevel = indentLevel;

      // Heading 1
      if (line.trim().startsWith("# ")) {
        newBlocks.push({
          id: uuidv4(),
          type: "heading1",
          content: line.trim().substring(2),
          level: indentLevel,
          parentId,
        });
      }
      // Heading 2
      else if (line.trim().startsWith("## ")) {
        newBlocks.push({
          id: uuidv4(),
          type: "heading2",
          content: line.trim().substring(3),
          level: indentLevel,
          parentId,
        });
      }
      // Heading 3
      else if (line.trim().startsWith("### ")) {
        newBlocks.push({
          id: uuidv4(),
          type: "heading3",
          content: line.trim().substring(4),
          level: indentLevel,
          parentId,
        });
      }
      // Checkbox
      else if (line.trim().match(/^-\s*\[\s?[xX]?\s?\]/)) {
        const isChecked = line.includes("[x]") || line.includes("[X]");
        const content = line.trim().replace(/^-\s*\[\s?[xX]?\s?\]\s*/, "");
        newBlocks.push({
          id: uuidv4(),
          type: "checkbox",
          content,
          checked: isChecked,
          level: indentLevel,
          parentId,
        });
      }
      // Ordered list
      else if (line.trim().match(/^\d+\.\s/)) {
        const content = line.trim().replace(/^\d+\.\s/, "");
        const orderNumber = Number.parseInt(
          line.trim().match(/^(\d+)/)?.[1] || "1",
          10
        );
        newBlocks.push({
          id: uuidv4(),
          type: "ordered-list",
          content,
          orderNumber,
          level: indentLevel,
          parentId,
        });
      }
      // Unordered list
      else if (line.trim().startsWith("- ")) {
        newBlocks.push({
          id: uuidv4(),
          type: "list",
          content: line.trim().substring(2),
          level: indentLevel,
          parentId,
        });
      }
      // Blockquote
      else if (line.trim().startsWith("> ")) {
        newBlocks.push({
          id: uuidv4(),
          type: "blockquote",
          content: line.trim().substring(2),
          level: indentLevel,
          parentId,
        });
      }
      // Horizontal rule
      else if (
        line.trim() === "---" ||
        line.trim() === "***" ||
        line.trim() === "___"
      ) {
        newBlocks.push({
          id: uuidv4(),
          type: "hr",
          content: "",
          level: indentLevel,
          parentId,
        });
      }
      // Inline code
      else if (
        line.trim().startsWith("`") &&
        line.trim().endsWith("`") &&
        !line.trim().startsWith("```")
      ) {
        newBlocks.push({
          id: uuidv4(),
          type: "inline-code",
          content: line.trim().substring(1, line.trim().length - 1),
          level: indentLevel,
          parentId,
        });
      }
      // Strikethrough
      else if (line.trim().startsWith("~~") && line.trim().endsWith("~~")) {
        newBlocks.push({
          id: uuidv4(),
          type: "strikethrough",
          content: line.trim().substring(2, line.trim().length - 2),
          level: indentLevel,
          parentId,
        });
      }
      // Image
      else if (
        line.trim().startsWith("![") &&
        line.trim().includes("](") &&
        line.trim().endsWith(")")
      ) {
        const urlMatch = line.trim().match(/!\[.*\]$$(.*)$$/);
        if (urlMatch && urlMatch[1]) {
          newBlocks.push({
            id: uuidv4(),
            type: "image",
            content: urlMatch[1],
            level: indentLevel,
            parentId,
          });
        }
      }
      // Link
      else if (line.trim().match(/^\[.*\]$$.*$$$/)) {
        const linkMatch = line.trim().match(/^\[(.*)\]$$(.*)$$$/);
        if (linkMatch) {
          const [, text, url] = linkMatch;
          newBlocks.push({
            id: uuidv4(),
            type: "link",
            content: url || text,
            level: indentLevel,
            parentId,
          });
        }
      }
      // Regular text
      else {
        newBlocks.push({
          id: uuidv4(),
          type: "text",
          content: line.trim(),
          level: indentLevel,
          parentId,
        });
      }
    });

    // Don't forget to add the last code block if there is one
    if (currentCodeBlock) {
      newBlocks.push(currentCodeBlock);
    }

    return newBlocks;
  }, []);

  const exportMarkdown = () => {
    const markdownContent = toMarkdown();
    const blob = new Blob([markdownContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "notes.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importMarkdown = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const markdownText = e.target?.result as string;
      const newBlocks = fromMarkdown(markdownText);
      setBlocks(newBlocks);
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full mx-auto p-4 max-w-3xl">
      <div className="flex justify-end gap-2 mb-4">
        <Button variant="outline" size="sm" onClick={exportMarkdown}>
          Экспорт в Markdown
        </Button>
        <label>
          <Button variant="outline" size="sm" asChild>
            <span>Импорт из Markdown</span>
          </Button>
          <input
            type="file"
            accept=".md"
            className="hidden"
            onChange={importMarkdown}
          />
        </label>
      </div>

      <div className="space-y-0.5">
        {blocks.map((block, index) => (
          <NoteBlock
            key={block.id}
            id={block.id}
            type={block.type}
            content={block.content}
            level={block.level}
            checked={block.checked}
            orderNumber={block.orderNumber}
            onUpdate={(id, content) => {
              updateBlock(id, content);
              handleMarkdownShortcut(id, content);
            }}
            onChangeType={changeBlockType}
            onDelete={deleteBlock}
            onAddNested={addNestedBlock}
            onToggleCheckbox={toggleCheckbox}
            onEnterKey={handleEnterKey}
            onIncreaseIndent={increaseIndent}
            onDecreaseIndent={decreaseIndent}
            isLastBlock={index === blocks.length - 1}
            isFocused={block.id === focusedBlockId}
            onFocused={() => setFocusedBlockId(null)}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onBlur={sendToServer}
            isDragging={draggedBlockId === block.id}
            isDraggedOver={
              dragOverInfo && dragOverInfo.id === block.id ? dragOverInfo : null
            }
          />
        ))}
      </div>

      <div className="flex justify-end mt-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-10 w-10"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={() => addBlock(blocks.length - 1, "text")}
            >
              <Text className="mr-2 h-3.5 w-3.5" />
              <span>Текст</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => addBlock(blocks.length - 1, "heading1")}
            >
              <Heading1 className="mr-2 h-3.5 w-3.5" />
              <span>Заголовок 1</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => addBlock(blocks.length - 1, "heading2")}
            >
              <Heading2 className="mr-2 h-3.5 w-3.5" />
              <span>Заголовок 2</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => addBlock(blocks.length - 1, "heading3")}
            >
              <Heading3 className="mr-2 h-3.5 w-3.5" />
              <span>Заголовок 3</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => addBlock(blocks.length - 1, "list")}
            >
              <List className="mr-2 h-3.5 w-3.5" />
              <span>Список</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => addBlock(blocks.length - 1, "ordered-list")}
            >
              <ListOrdered className="mr-2 h-3.5 w-3.5" />
              <span>Нумерованный список</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => addBlock(blocks.length - 1, "checkbox")}
            >
              <CheckSquare className="mr-2 h-3.5 w-3.5" />
              <span>Чекбокс</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => addBlock(blocks.length - 1, "code")}
            >
              <Code className="mr-2 h-3.5 w-3.5" />
              <span>Блок кода</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => addBlock(blocks.length - 1, "inline-code")}
            >
              <CodeSquare className="mr-2 h-3.5 w-3.5" />
              <span>Строчный код</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => addBlock(blocks.length - 1, "link")}
            >
              <Link className="mr-2 h-3.5 w-3.5" />
              <span>Ссылка</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => addBlock(blocks.length - 1, "blockquote")}
            >
              <Quote className="mr-2 h-3.5 w-3.5" />
              <span>Цитата</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => addBlock(blocks.length - 1, "hr")}>
              <SeparatorHorizontal className="mr-2 h-3.5 w-3.5" />
              <span>Разделитель</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => addBlock(blocks.length - 1, "image")}
            >
              <ImageIcon className="mr-2 h-3.5 w-3.5" />
              <span>Изображение</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => addBlock(blocks.length - 1, "strikethrough")}
            >
              <Strikethrough className="mr-2 h-3.5 w-3.5" />
              <span>Зачеркнутый текст</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
