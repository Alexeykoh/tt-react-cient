"use client"

import { useState } from "react"
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core"
import { SortableContext, arrayMove } from "@dnd-kit/sortable"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import KanbanItem from "./kanban-item"
import KanbanColumn from "./kanban-column"


// Define types for our data structure
type Item = {
  id: string
  content: string
}

type Column = {
  id: string
  title: string
  items: Item[]
}

// Initial data
const initialColumns: Column[] = [
  {
    id: "todo",
    title: "To Do",
    items: [
      { id: "task-1", content: "Research competitors" },
      { id: "task-2", content: "Design wireframes" },
      { id: "task-3", content: "Set up project repository" },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    items: [
      { id: "task-4", content: "Develop landing page" },
      { id: "task-5", content: "Create authentication flow" },
    ],
  },
  {
    id: "review",
    title: "Review",
    items: [
      { id: "task-6", content: "Code review for PR #42" },
      { id: "task-7", content: "Test user registration" },
    ],
  },
  {
    id: "done",
    title: "Done",
    items: [
      { id: "task-8", content: "Project setup" },
      { id: "task-9", content: "Create component library" },
    ],
  },
]

export default function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(initialColumns)
  const [activeItem, setActiveItem] = useState<Item | null>(null)
  const [newColumnTitle, setNewColumnTitle] = useState("")
  const [showNewColumnInput, setShowNewColumnInput] = useState(false)

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const activeId = active.id as string

    // Find the item being dragged
    for (const column of columns) {
      const foundItem = column.items.find((item) => item.id === activeId)
      if (foundItem) {
        setActiveItem(foundItem)
        break
      }
    }
  }

  // Handle drag over
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Find source and destination columns
    const activeColumnIndex = columns.findIndex((col) => col.items.some((item) => item.id === activeId))
    const overColumnIndex = columns.findIndex(
      (col) => col.id === overId || col.items.some((item) => item.id === overId),
    )

    if (activeColumnIndex === -1 || overColumnIndex === -1) return

    const activeColumn = columns[activeColumnIndex]
    const overColumn = columns[overColumnIndex]

    // If dragging over a different column
    if (activeColumnIndex !== overColumnIndex) {
      const activeItemIndex = activeColumn.items.findIndex((item) => item.id === activeId)

      // Create new columns array
      const newColumns = [...columns]

      // Remove item from source column
      const [movedItem] = newColumns[activeColumnIndex].items.splice(activeItemIndex, 1)

      // If dropping on column, add to end of column
      if (overId === overColumn.id) {
        newColumns[overColumnIndex].items.push(movedItem)
      } else {
        // If dropping on item, find position and insert
        const overItemIndex = overColumn.items.findIndex((item) => item.id === overId)
        newColumns[overColumnIndex].items.splice(overItemIndex, 0, movedItem)
      }

      setColumns(newColumns)
    }
  }

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveItem(null)

    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Find source column
    const activeColumnIndex = columns.findIndex((col) => col.items.some((item) => item.id === activeId))
    if (activeColumnIndex === -1) return

    const activeColumn = columns[activeColumnIndex]

    // If reordering within the same column
    const activeItemIndex = activeColumn.items.findIndex((item) => item.id === activeId)
    const overItemIndex = activeColumn.items.findIndex((item) => item.id === overId)

    if (activeItemIndex !== -1 && overItemIndex !== -1) {
      const newColumns = [...columns]
      newColumns[activeColumnIndex].items = arrayMove(
        newColumns[activeColumnIndex].items,
        activeItemIndex,
        overItemIndex,
      )
      setColumns(newColumns)
    }
  }

  // Add a new column
  const handleAddColumn = () => {
    if (newColumnTitle.trim() === "") return

    const newColumn: Column = {
      id: `column-${Date.now()}`,
      title: newColumnTitle,
      items: [],
    }

    setColumns([...columns, newColumn])
    setNewColumnTitle("")
    setShowNewColumnInput(false)
  }

  // Add a new item to a column
  const handleAddItem = (columnId: string, content: string) => {
    if (content.trim() === "") return

    const newItem: Item = {
      id: `task-${Date.now()}`,
      content,
    }

    const newColumns = columns.map((column) => {
      if (column.id === columnId) {
        return {
          ...column,
          items: [...column.items, newItem],
        }
      }
      return column
    })

    setColumns(newColumns)
  }

  // Delete a column
  const handleDeleteColumn = (columnId: string) => {
    setColumns(columns.filter((column) => column.id !== columnId))
  }

  // Delete an item
  const handleDeleteItem = (columnId: string, itemId: string) => {
    const newColumns = columns.map((column) => {
      if (column.id === columnId) {
        return {
          ...column,
          items: column.items.filter((item) => item.id !== itemId),
        }
      }
      return column
    })

    setColumns(newColumns)
  }

  return (
    <div className="space-y-4">
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((column) => (
            <SortableContext key={column.id} items={column.items.map((item) => item.id)}>
              <KanbanColumn
                id={column.id}
                title={column.title}
                items={column.items}
                onAddItem={(content) => handleAddItem(column.id, content)}
                onDeleteItem={(itemId) => handleDeleteItem(column.id, itemId)}
                onDeleteColumn={() => handleDeleteColumn(column.id)}
              />
            </SortableContext>
          ))}

          {/* Add new column button or input */}
          <div className="h-fit">
            {showNewColumnInput ? (
              <Card className="p-4 space-y-4">
                <Input
                  placeholder="Column title"
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddColumn()
                    if (e.key === "Escape") {
                      setShowNewColumnInput(false)
                      setNewColumnTitle("")
                    }
                  }}
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button onClick={handleAddColumn} size="sm">
                    Add
                  </Button>
                  <Button
                    onClick={() => {
                      setShowNewColumnInput(false)
                      setNewColumnTitle("")
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </Card>
            ) : (
              <Button
                variant="outline"
                className="w-full h-[200px] border-dashed flex flex-col gap-2"
                onClick={() => setShowNewColumnInput(true)}
              >
                <PlusCircle className="h-6 w-6" />
                <span>Add Column</span>
              </Button>
            )}
          </div>
        </div>

        {/* Drag overlay for visual feedback */}
        <DragOverlay>
          {activeItem && (
            <div className="opacity-80">
              <KanbanItem id={activeItem.id} content={activeItem.content} />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
