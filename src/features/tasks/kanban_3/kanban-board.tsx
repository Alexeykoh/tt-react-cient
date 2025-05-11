import { PAYMENT, Task } from "@/shared/interfaces/task.interface";
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import { CSS } from "@dnd-kit/utilities";

export default function KanbanBoard_3() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      task_id: "1",
      name: "111",
      description: "",
      is_paid: false,
      payment_type: PAYMENT.FIXED,
      project_id: "",
      rate: "",
      created_at: "",
      currency: {
        currency_id: "",
        symbol: "",
        name: "",
        code: "",
      },
      order: 0,
      project: {
        project_id: "",
        name: "",
      },
      taskStatus: {
        id: "",
        taskStatusColumn: {
          id: "",
          name: "",
          color: "",
        },
      },
      taskMembers: [],
    },
    {
      task_id: "2",
      name: "222",
      description: "",
      is_paid: false,
      payment_type: PAYMENT.FIXED,
      project_id: "",
      rate: "",
      created_at: "",
      currency: {
        currency_id: "",
        symbol: "",
        name: "",
        code: "",
      },
      order: 0,
      project: {
        project_id: "",
        name: "",
      },
      taskStatus: {
        id: "",
        taskStatusColumn: {
          id: "",
          name: "",
          color: "",
        },
      },
      taskMembers: [],
    },
    {
      task_id: "3",
      name: "333",
      description: "",
      is_paid: false,
      payment_type: PAYMENT.FIXED,
      project_id: "",
      rate: "",
      created_at: "",
      currency: {
        currency_id: "",
        symbol: "",
        name: "",
        code: "",
      },
      order: 0,
      project: {
        project_id: "",
        name: "",
      },
      taskStatus: {
        id: "",
        taskStatusColumn: {
          id: "",
          name: "",
          color: "",
        },
      },
      taskMembers: [],
    },
  ]);

  function getTaskPos(id: string): number {
    return tasks.findIndex((task) => task.task_id === id);
  }

  function handleDragEnd(event: DragEndEvent): void {
    const { over, active } = event;
    if (active.id !== over?.id) {
      setTasks((tasks) => {
        const originalPos = getTaskPos(active.id);
        const newPos = getTaskPos(over?.id ?? "");
        return arrayMove(tasks, originalPos, newPos);
      });
    }
  }

  return (
    <div className="flex flex-col">
      <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
        <Column tasks={tasks} />
      </DndContext>
    </div>
  );
}

function Column({ tasks }: { tasks: Task[] }) {
  return (
    <div className="flex flex-col bg-gray-700 h-96 w-64 gap-2 p-2">
      <SortableContext
        items={tasks.map((task) => ({ id: task.task_id.toString() }))}
        strategy={verticalListSortingStrategy}
      >
        {tasks.map((task) => (
          <TaskCard key={task.task_id} task={task} />
        ))}
      </SortableContext>
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.task_id.toString() });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="flex flex-col bg-slate-500 rounded-lg p-2"
    >
      <p>{task.name}</p>
    </div>
  );
}
