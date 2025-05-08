"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { MoreHorizontal, PlusCircle, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import KanbanItem from "./kanban-item";

type Item = {
  id: string;
  content: string;
};

interface KanbanColumnProps {
  id: string;
  title: string;
  items: Item[];
  onAddItem: (content: string) => void;
  onDeleteItem: (itemId: string) => void;
  onDeleteColumn: () => void;
}

export default function KanbanColumn({
  id,
  title,
  items,
  onAddItem,
  onDeleteItem,
  onDeleteColumn,
}: KanbanColumnProps) {
  const [newItemContent, setNewItemContent] = useState("");
  const [showNewItemInput, setShowNewItemInput] = useState(false);

  // Set up droppable area
  const { setNodeRef } = useDroppable({
    id,
  });

  const handleAddItem = () => {
    if (newItemContent.trim() !== "") {
      onAddItem(newItemContent);
      setNewItemContent("");
      setShowNewItemInput(false);
    }
  };

  return (
    <Card className="flex flex-col w-72 rounded-lg p-2 overflow-y-hidden">
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
        <h3 className="font-medium text-sm">{title}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={onDeleteColumn}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Column
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent
        ref={setNodeRef}
        className="flex-1 p-4 pt-2 overflow-y-auto min-h-[200px]"
      >
        <SortableContext items={items.map((item) => item.id)}>
          <div className="space-y-2">
            {items.map((item) => (
              <KanbanItem
                key={item.id}
                id={item.id}
                content={item.content}
                onDelete={() => onDeleteItem(item.id)}
              />
            ))}
          </div>
        </SortableContext>
      </CardContent>
    </Card>
  );
}
