import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  MoreVertical,
  Trash2,
  Text,
  List,
  ListTree,
  Heading1,
  Heading2,
  CheckSquare,
  Code,
  Link,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

type BlockType = "text" | "heading1" | "heading2" | "list" | "checkbox" | "code" | "link";

interface NoteBlockProps {
  id: string;
  type: BlockType;
  content: string;
  level?: number;
  onUpdate: (id: string, content: string) => void;
  onChangeType: (id: string, type: BlockType) => void;
  onDelete: (id: string) => void;
  onAddNested?: (parentId: string) => void;
}

export const NoteBlock = ({
  id,
  type,
  content,
  level = 0,
  onUpdate,
  onChangeType,
  onDelete,
  onAddNested,
}: NoteBlockProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (type === "link" && !content.startsWith("http")) {
      setLinkUrl(content);
    }
  }, [type, content]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(id, e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab" && type === "list" && onAddNested) {
      e.preventDefault();
      onAddNested(id);
    }
  };

  const handleLinkSubmit = () => {
    onUpdate(id, linkUrl);
    setIsLinkModalOpen(false);
  };

  const renderPlaceholder = () => {
    switch (type) {
      case "heading1":
        return "Заголовок 1 уровня";
      case "heading2":
        return "Заголовок 2 уровня";
      case "list":
        return level > 0 ? "Подпункт" : "Пункт списка";
      case "checkbox":
        return "Чекбокс";
      case "code":
        return "Введите код...";
      case "link":
        return "Введите URL...";
      default:
        return "Начните писать...";
    }
  };

  const renderInput = () => {
    const baseClasses = "w-full bg-transparent outline-none border-0 p-0 m-0 focus-visible:ring-0";

    switch (type) {
      case "heading1":
        return (
          <Input
            ref={inputRef}
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={renderPlaceholder()}
            className={`${baseClasses} text-3xl font-bold`}
          />
        );
      case "heading2":
        return (
          <Input
            ref={inputRef}
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={renderPlaceholder()}
            className={`${baseClasses} text-2xl font-semibold`}
          />
        );
      case "checkbox":
        return (
          <div className="flex items-center gap-2 w-full">
            <input type="checkbox" className="h-4 w-4" />
            <Input
              ref={inputRef}
              value={content}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={renderPlaceholder()}
              className={baseClasses}
            />
          </div>
        );
      case "list":
        return (
          <div className="flex items-center gap-2 w-full" style={{ paddingLeft: `${level * 16}px` }}>
            <span className="text-gray-400 flex-shrink-0">{level > 0 ? "◦" : "•"}</span>
            <Input
              ref={inputRef}
              value={content}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={renderPlaceholder()}
              className={baseClasses}
            />
          </div>
        );
      case "code":
        return (
          <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded font-mono text-sm w-full">
            <Input
              ref={inputRef}
              value={content}
              onChange={handleChange}
              placeholder={renderPlaceholder()}
              className={`${baseClasses} bg-gray-100 dark:bg-gray-800`}
            />
          </div>
        );
      case "link":
        return (
          <div className="flex items-center gap-2 w-full">
            <Link className="h-4 w-4 flex-shrink-0" />
            <Input
              ref={inputRef}
              value={content}
              onChange={handleChange}
              placeholder={renderPlaceholder()}
              className={baseClasses}
            />
          </div>
        );
      default:
        return (
          <Input
            ref={inputRef}
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={renderPlaceholder()}
            className={baseClasses}
          />
        );
    }
  };

  return (
    <div
      className="relative w-full group py-0.5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex w-full">
        <div className="flex-1 w-full">
          {renderInput()}
        </div>
      </div>

      {isHovered && (
        <div className="absolute left-0 top-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
              >
                <MoreVertical className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onChangeType(id, "text")}>
                <Text className="mr-2 h-3.5 w-3.5" />
                <span>Текст</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onChangeType(id, "heading1")}>
                <Heading1 className="mr-2 h-3.5 w-3.5" />
                <span>Заголовок 1</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onChangeType(id, "heading2")}>
                <Heading2 className="mr-2 h-3.5 w-3.5" />
                <span>Заголовок 2</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onChangeType(id, "list")}>
                <List className="mr-2 h-3.5 w-3.5" />
                <span>Список</span>
              </DropdownMenuItem>
              {type === "list" && onAddNested && (
                <DropdownMenuItem onClick={() => onAddNested(id)}>
                  <ListTree className="mr-2 h-3.5 w-3.5" />
                  <span>Вложенный список</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onChangeType(id, "checkbox")}>
                <CheckSquare className="mr-2 h-3.5 w-3.5" />
                <span>Чекбокс</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onChangeType(id, "code")}>
                <Code className="mr-2 h-3.5 w-3.5" />
                <span>Код</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                onChangeType(id, "link");
                setIsLinkModalOpen(true);
              }}>
                <Link className="mr-2 h-3.5 w-3.5" />
                <span>Ссылка</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => onDelete(id)}
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                <span>Удалить</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Модальное окно для ссылок */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md w-80">
            <h3 className="text-lg font-medium mb-2">Введите URL</h3>
            <Input
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="mb-2"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsLinkModalOpen(false)}>
                Отмена
              </Button>
              <Button onClick={handleLinkSubmit}>Сохранить</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
