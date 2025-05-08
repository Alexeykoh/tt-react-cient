"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Clock, DollarSign, Trash2, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { PAYMENT, Task } from "@/shared/interfaces/task.interface"

interface KanbanItemProps {
  id: string
  task: Task
  onDelete?: () => void
}

export default function KanbanItem({ id, task, onDelete }: KanbanItemProps) {
  // Set up sortable item
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  // Apply styles for dragging
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  }

  // Format the payment information
  const formatPayment = () => {
    if (!task.is_paid) return null

    const symbol = task.currency.symbol

    if (task.payment_type === PAYMENT.FIXED) {
      return `${symbol}${task.rate}`
    } else {
      return `${symbol}${task.rate}/hr`
    }
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="cursor-grab active:cursor-grabbing group"
      {...attributes}
      {...listeners}
    >
      <CardContent className="p-3 space-y-2">
        <div className="flex justify-between items-start">
          <h4 className="text-sm font-medium">{task.name}</h4>
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
        </div>

        {task.description && <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>}

        <div className="flex flex-wrap gap-2 items-center text-xs">
          {task.project.name && (
            <Badge variant="outline" className="text-xs font-normal">
              {task.project.name}
            </Badge>
          )}

          {task.is_paid && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    {formatPayment()}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>{task.payment_type === PAYMENT.FIXED ? "Fixed payment" : "Hourly rate"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {task.taskMembers.length > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {task.taskMembers.length}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs">
                    {task.taskMembers.map((member) => (
                      <div key={member.member_id}>{member.user.name}</div>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="flex items-center gap-1 ml-auto">
                  <Clock className="h-3 w-3" />
                  {new Date(task.created_at).toLocaleDateString()}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>Created on {new Date(task.created_at).toLocaleString()}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  )
}
