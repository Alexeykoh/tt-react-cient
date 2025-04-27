// features/tasks/sortable-column.tsx
import { Card } from '@/components/ui/card'
import { Task, TaskStatusColumn } from '@/shared/interfaces/task.interface'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { SortableTask } from './sortable-task'

export const SortableColumn = ({
  column,
  tasks
}: {
  column: TaskStatusColumn
  tasks: Task[]
}) => {
  return (
    <Card className="flex-shrink-0 w-72 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">{column.name}</h3>
        <span className="text-sm text-gray-500">{tasks.length}</span>
      </div>
      
      <SortableContext 
        items={tasks.map(t => t.task_id)} 
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {tasks.map(task => (
            <SortableTask key={task.task_id} task={task} />
          ))}
        </div>
      </SortableContext>
    </Card>
  )
}
