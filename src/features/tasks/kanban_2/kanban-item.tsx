"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface KanbanItemProps {
  id: string
  content: string
  onDelete?: () => void
}

export default function KanbanItem({ id, content, onDelete }: KanbanItemProps) {
  // Set up sortable item
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  // Apply styles for dragging
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="cursor-grab active:cursor-grabbing group"
      {...attributes}
      {...listeners}
    >
      <CardContent className="p-3 flex justify-between items-start">
        <p className="text-sm">{content}</p>
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
          >
            <Trash2 className="h-3 w-3" />
            <span className="sr-only">Delete</span>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
