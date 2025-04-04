"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  LinkIcon,
  List,
  ListOrdered,
  Code,
  CheckSquare,
  Heading1,
  Heading2,
  Heading3,
  Text,
  Quote,
  SeparatorHorizontal,
  ImageIcon,
  Strikethrough,
  CodeSquare,
  GripVertical,
} from "lucide-react";
import { useState, useRef, useEffect, type KeyboardEvent } from "react";

type BlockType =
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

interface NoteBlockProps {
  id: string;
  type: BlockType;
  content: string;
  level?: number;
  checked?: boolean;
  orderNumber?: number;
  isLastBlock?: boolean;
  isFocused?: boolean;
  onUpdate: (id: string, content: string) => void;
  onChangeType: (id: string, type: BlockType) => void;
  onDelete: (id: string) => void;
  onAddNested?: (parentId: string) => void;
  onToggleCheckbox?: (id: string) => void;
  onEnterKey: (id: string) => string | null;
  onIncreaseIndent: (id: string) => void;
  onDecreaseIndent: (id: string) => void;
  onFocused?: () => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onDragOver: (id: string, position: "before" | "after" | "inside") => void;
  onBlur: () => void;
  isDragging: boolean;
  isDraggedOver?: {
    id: string;
    position: "before" | "after" | "inside";
  } | null;
}

export const NoteBlock = ({
  id,
  type,
  content,
  level = 0,
  checked = false,
  orderNumber = 1,
  isLastBlock = false,
  isFocused = false,
  onUpdate,
  onChangeType,
  onDelete,
  onAddNested,
  onToggleCheckbox,
  onEnterKey,
  onIncreaseIndent,
  onDecreaseIndent,
  onFocused,
  onDragStart,
  onDragEnd,
  onDragOver,
  isDragging,
  isDraggedOver,
}: NoteBlockProps) => {
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const typeMenuRef = useRef<HTMLDivElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (type === "link" && !content.startsWith("http")) {
      setLinkUrl(content);
    } else if (type === "image") {
      setImageUrl(content);
    }
  }, [type, content]);

  // Focus the input when isFocused is true
  useEffect(() => {
    if (isFocused && inputRef.current) {
      // Use a small timeout to ensure the DOM is ready
      setTimeout(() => {
        inputRef.current?.focus();
        if (onFocused) onFocused();
      }, 10);
    }
  }, [isFocused, onFocused]);

  // Close type menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        typeMenuRef.current &&
        !typeMenuRef.current.contains(event.target as Node)
      ) {
        setShowTypeMenu(false);
      }
    };

    if (showTypeMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTypeMenu]);

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";

    // Add a small delay to make the drag visual effect work properly
    setTimeout(() => {
      onDragStart(id);
    }, 0);
  };

  const handleDragEnd = () => {
    onDragEnd();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!blockRef.current) return;

    const rect = blockRef.current.getBoundingClientRect();
    const mouseY = e.clientY;

    // Calculate relative position within the element
    const relativeY = mouseY - rect.top;
    const height = rect.height;

    // Determine if we're in the top, middle, or bottom third of the element
    if (relativeY < height * 0.33) {
      // Top third - drop before
      onDragOver(id, "before");
    } else if (relativeY > height * 0.66) {
      // Bottom third - drop after
      onDragOver(id, "after");
    } else {
      // Middle third - drop inside (as a child)
      onDragOver(id, "inside");
    }
  };

  const handleDragLeave = () => {
    // This is handled by the parent component
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    // The actual drop logic is handled in the parent component
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(id, e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Handle Enter key to create a new block of the same type
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onEnterKey(id);
    }

    // Handle Tab key for indentation
    if (e.key === "Tab") {
      e.preventDefault();
      if (e.shiftKey) {
        // Shift+Tab decreases indentation
        onDecreaseIndent(id);
      } else {
        // Tab increases indentation
        onIncreaseIndent(id);
      }
    }

    // Handle Backspace to delete empty blocks
    if (e.key === "Backspace" && content === "") {
      e.preventDefault();
      onDelete(id);
    }
  };

  const handleLinkSubmit = () => {
    onUpdate(id, linkUrl);
    setIsLinkModalOpen(false);
  };

  const handleImageSubmit = () => {
    onUpdate(id, imageUrl);
    setIsImageModalOpen(false);
  };

  // Toggle the type menu
  const toggleTypeMenu = () => {
    setShowTypeMenu(!showTypeMenu);
  };

  // Convert to a different type
  const convertToType = (newType: BlockType) => {
    onChangeType(id, newType);
    setShowTypeMenu(false);
  };

  const renderPlaceholder = () => {
    switch (type) {
      case "heading1":
        return "Заголовок 1 уровня";
      case "heading2":
        return "Заголовок 2 уровня";
      case "heading3":
        return "Заголовок 3 уровня";
      case "list":
        return level > 0 ? "Подпункт" : "Пункт списка";
      case "ordered-list":
        return level > 0 ? "Нумерованный подпункт" : "Нумерованный пункт";
      case "checkbox":
        return "Чекбокс";
      case "code":
        return "Введите код...";
      case "inline-code":
        return "Введите строчный код...";
      case "link":
        return "Введите URL...";
      case "blockquote":
        return "Введите цитату...";
      case "hr":
        return "Горизонтальный разделитель";
      case "image":
        return "URL изображения...";
      case "strikethrough":
        return "Зачеркнутый текст...";
      default:
        return "Начните писать...";
    }
  };

  // Determine drag-over styling
  const getDragOverClass = () => {
    if (!isDraggedOver || isDraggedOver.id !== id) return "";

    switch (isDraggedOver.position) {
      case "before":
        return 'before:content-[""] before:absolute before:left-0 before:right-0 before:top-0 before:h-0.5 before:bg-blue-500';
      case "after":
        return 'after:content-[""] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-0.5 after:bg-blue-500';
      case "inside":
        return "ring-2 ring-blue-500 ring-inset";
      default:
        return "";
    }
  };

  const renderInput = () => {
    const baseClasses =
      "w-full bg-transparent outline-none border-0 p-0 m-0 focus-visible:ring-0";
    const indentStyle = { paddingLeft: `${level * 16}px` };

    switch (type) {
      case "heading1":
        return (
          <div style={indentStyle} className="group relative">
            <Input
              id={`block-${id}`}
              ref={inputRef}
              value={content}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={renderPlaceholder()}
              className={`${baseClasses} text-3xl font-bold`}
            />
            <button
              onClick={toggleTypeMenu}
              className="absolute left-[-24px] top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Heading1 className="h-4 w-4 text-gray-400" />
            </button>
            {isLastBlock && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddNested?.(id)}
              >
                Добавить вложенный блок
              </Button>
            )}
          </div>
        );
      case "heading2":
        return (
          <div style={indentStyle} className="group relative">
            <Input
              id={`block-${id}`}
              ref={inputRef}
              value={content}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={renderPlaceholder()}
              className={`${baseClasses} text-2xl font-semibold`}
            />
            <button
              onClick={toggleTypeMenu}
              className="absolute left-[-24px] top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Heading2 className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        );
      case "heading3":
        return (
          <div style={indentStyle} className="group relative">
            <Input
              id={`block-${id}`}
              ref={inputRef}
              value={content}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={renderPlaceholder()}
              className={`${baseClasses} text-xl font-semibold`}
            />
            <button
              onClick={toggleTypeMenu}
              className="absolute left-[-24px] top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Heading3 className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        );
      case "checkbox":
        return (
          <div
            className="flex items-center gap-2 w-full group relative"
            style={indentStyle}
          >
            <Checkbox
              checked={checked}
              onCheckedChange={() => onToggleCheckbox?.(id)}
              className="h-4 w-4"
            />
            <Input
              id={`block-${id}`}
              ref={inputRef}
              value={content}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={renderPlaceholder()}
              className={baseClasses}
            />
            <button
              onClick={toggleTypeMenu}
              className="absolute left-[-24px] top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <CheckSquare className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        );
      case "list":
        return (
          <div
            className="flex items-center gap-2 w-full group relative"
            style={indentStyle}
          >
            <span className="text-gray-400 flex-shrink-0">•</span>
            <Input
              id={`block-${id}`}
              ref={inputRef}
              value={content}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={renderPlaceholder()}
              className={baseClasses}
            />
            <button
              onClick={toggleTypeMenu}
              className="absolute left-[-24px] top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <List className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        );
      case "ordered-list":
        return (
          <div
            className="flex items-center gap-2 w-full group relative"
            style={indentStyle}
          >
            <span className="text-gray-400 flex-shrink-0">{orderNumber}.</span>
            <Input
              id={`block-${id}`}
              ref={inputRef}
              value={content}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={renderPlaceholder()}
              className={baseClasses}
            />
            <button
              onClick={toggleTypeMenu}
              className="absolute left-[-24px] top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ListOrdered className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        );
      case "code":
        return (
          <div
            className="bg-gray-100 dark:bg-gray-800 p-1 rounded font-mono text-sm w-full group relative"
            style={indentStyle}
          >
            <Input
              id={`block-${id}`}
              ref={inputRef}
              value={content}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={renderPlaceholder()}
              className={`${baseClasses} bg-gray-100 dark:bg-gray-800`}
            />
            <button
              onClick={toggleTypeMenu}
              className="absolute left-[-24px] top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Code className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        );
      case "inline-code":
        return (
          <div
            className="inline-flex items-center group relative"
            style={indentStyle}
          >
            <span className="text-gray-400 flex-shrink-0">`</span>
            <Input
              id={`block-${id}`}
              ref={inputRef}
              value={content}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={renderPlaceholder()}
              className={`${baseClasses} font-mono`}
            />
            <span className="text-gray-400 flex-shrink-0">`</span>
            <button
              onClick={toggleTypeMenu}
              className="absolute left-[-24px] top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <CodeSquare className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        );
      case "link":
        return (
          <div
            className="flex items-center gap-2 w-full group relative"
            style={indentStyle}
          >
            <LinkIcon className="h-4 w-4 flex-shrink-0" />
            <Input
              id={`block-${id}`}
              ref={inputRef}
              value={content}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={renderPlaceholder()}
              className={baseClasses}
            />
            <button
              onClick={() => setIsLinkModalOpen(true)}
              className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <LinkIcon className="h-4 w-4" />
            </button>
            <button
              onClick={toggleTypeMenu}
              className="absolute left-[-24px] top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <LinkIcon className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        );
      case "blockquote":
        return (
          <div
            className="pl-4 border-l-4 border-gray-300 dark:border-gray-600 group relative"
            style={indentStyle}
          >
            <Input
              id={`block-${id}`}
              ref={inputRef}
              value={content}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={renderPlaceholder()}
              className={`${baseClasses} italic`}
            />
            <button
              onClick={toggleTypeMenu}
              className="absolute left-[-24px] top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Quote className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        );
      case "hr":
        return (
          <div className="relative group" style={indentStyle}>
            <hr className="my-2 border-t-2 border-gray-300 dark:border-gray-600" />
            <button
              onClick={toggleTypeMenu}
              className="absolute left-[-24px] top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <SeparatorHorizontal className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        );
      case "image":
        return (
          <div
            className="flex flex-col gap-2 w-full group relative"
            style={indentStyle}
          >
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 flex-shrink-0" />
              <Input
                id={`block-${id}`}
                ref={inputRef}
                value={content}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={renderPlaceholder()}
                className={baseClasses}
              />
              <button
                onClick={() => setIsImageModalOpen(true)}
                className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <ImageIcon className="h-4 w-4" />
              </button>
            </div>
            {content && (
              <div className="mt-2 max-w-full">
                <img
                  src={content || "/placeholder.svg"}
                  alt="Preview"
                  className="max-h-64 object-contain rounded border border-gray-200 dark:border-gray-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
            <button
              onClick={toggleTypeMenu}
              className="absolute left-[-24px] top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ImageIcon className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        );
      case "strikethrough":
        return (
          <div style={indentStyle} className="group relative">
            <div className="flex items-center">
              <span className="text-gray-400 flex-shrink-0">~~</span>
              <Input
                id={`block-${id}`}
                ref={inputRef}
                value={content}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={renderPlaceholder()}
                className={`${baseClasses} line-through`}
              />
              <span className="text-gray-400 flex-shrink-0">~~</span>
            </div>
            <button
              onClick={toggleTypeMenu}
              className="absolute left-[-24px] top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Strikethrough className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        );
      default:
        return (
          <div style={indentStyle} className="group relative">
            <Input
              id={`block-${id}`}
              ref={inputRef}
              value={content}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={renderPlaceholder()}
              className={baseClasses}
            />
            <button
              onClick={toggleTypeMenu}
              className="absolute left-[-24px] top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Text className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        );
    }
  };

  return (
    <div
      ref={blockRef}
      className={`relative w-full py-0.5 ${isDragging ? "opacity-50" : ""} ${getDragOverClass()}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex w-full">
        <div
          ref={dragHandleRef}
          className="absolute left-[-40px] top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity cursor-grab"
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
        <div className="flex-1 w-full">{renderInput()}</div>
      </div>

      {/* Type conversion menu */}
      {showTypeMenu && (
        <div
          ref={typeMenuRef}
          className="absolute left-[-120px] top-0 bg-white dark:bg-gray-800 shadow-md rounded-md p-2 z-10"
        >
          <div className="flex flex-col gap-1">
            <button
              onClick={() => convertToType("text")}
              className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm text-sm"
            >
              <Text className="h-3.5 w-3.5" />
              <span>Текст</span>
            </button>
            <button
              onClick={() => convertToType("heading1")}
              className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm text-sm"
            >
              <Heading1 className="h-3.5 w-3.5" />
              <span>Заголовок 1</span>
            </button>
            <button
              onClick={() => convertToType("heading2")}
              className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm text-sm"
            >
              <Heading2 className="h-3.5 w-3.5" />
              <span>Заголовок 2</span>
            </button>
            <button
              onClick={() => convertToType("heading3")}
              className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm text-sm"
            >
              <Heading3 className="h-3.5 w-3.5" />
              <span>Заголовок 3</span>
            </button>
            <button
              onClick={() => convertToType("list")}
              className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm text-sm"
            >
              <List className="h-3.5 w-3.5" />
              <span>Список</span>
            </button>
            <button
              onClick={() => convertToType("ordered-list")}
              className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm text-sm"
            >
              <ListOrdered className="h-3.5 w-3.5" />
              <span>Нумерованный список</span>
            </button>
            <button
              onClick={() => convertToType("checkbox")}
              className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm text-sm"
            >
              <CheckSquare className="h-3.5 w-3.5" />
              <span>Чекбокс</span>
            </button>
            <button
              onClick={() => convertToType("code")}
              className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm text-sm"
            >
              <Code className="h-3.5 w-3.5" />
              <span>Блок кода</span>
            </button>
            <button
              onClick={() => convertToType("inline-code")}
              className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm text-sm"
            >
              <CodeSquare className="h-3.5 w-3.5" />
              <span>Строчный код</span>
            </button>
            <button
              onClick={() => convertToType("link")}
              className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm text-sm"
            >
              <LinkIcon className="h-3.5 w-3.5" />
              <span>Ссылка</span>
            </button>
            <button
              onClick={() => convertToType("blockquote")}
              className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm text-sm"
            >
              <Quote className="h-3.5 w-3.5" />
              <span>Цитата</span>
            </button>
            <button
              onClick={() => convertToType("hr")}
              className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm text-sm"
            >
              <SeparatorHorizontal className="h-3.5 w-3.5" />
              <span>Разделитель</span>
            </button>
            <button
              onClick={() => convertToType("image")}
              className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm text-sm"
            >
              <ImageIcon className="h-3.5 w-3.5" />
              <span>Изображение</span>
            </button>
            <button
              onClick={() => convertToType("strikethrough")}
              className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm text-sm"
            >
              <Strikethrough className="h-3.5 w-3.5" />
              <span>Зачеркнутый текст</span>
            </button>
          </div>
        </div>
      )}

      {/* Модальное окно для ссылок */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-md w-80">
            <h3 className="text-lg font-medium mb-2">Введите URL</h3>
            <Input
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="mb-2"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsLinkModalOpen(false)}
              >
                Отмена
              </Button>
              <Button onClick={handleLinkSubmit}>Сохранить</Button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно для изображений */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-md w-80">
            <h3 className="text-lg font-medium mb-2">
              Введите URL изображения
            </h3>
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="mb-2"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsImageModalOpen(false)}
              >
                Отмена
              </Button>
              <Button onClick={handleImageSubmit}>Сохранить</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
