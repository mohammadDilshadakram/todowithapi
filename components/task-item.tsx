"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { updateTask, deleteTask } from "@/lib/features/tasks/tasksSlice"
import type { Task } from "@/lib/features/tasks/types"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash, Save, X, Cloud } from "lucide-react"
import { cn } from "@/lib/utils"

interface TaskItemProps {
  task: Task
}

export default function TaskItem({ task }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(task.text)
  const dispatch = useDispatch()

  const handleToggleComplete = () => {
    dispatch(
      updateTask({
        ...task,
        completed: !task.completed,
      }),
    )
  }

  const handleDelete = () => {
    dispatch(deleteTask(task.id))
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditText(task.text)
  }

  const handleSave = () => {
    if (editText.trim()) {
      dispatch(
        updateTask({
          ...task,
          text: editText,
        }),
      )
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500 hover:bg-red-600"
      case "medium":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "low":
        return "bg-green-500 hover:bg-green-600"
      default:
        return "bg-blue-500 hover:bg-blue-600"
    }
  }

  return (
    <div
      className={cn(
        "p-4 border rounded-md flex items-center gap-3 transition-colors",
        task.completed ? "bg-muted/50" : "bg-card",
      )}
    >
      <Checkbox
        checked={task.completed}
        onCheckedChange={handleToggleComplete}
        aria-label={`Mark "${task.text}" as ${task.completed ? "incomplete" : "complete"}`}
      />

      <div className="flex-1">
        {isEditing ? (
          <Input value={editText} onChange={(e) => setEditText(e.target.value)} className="w-full" autoFocus />
        ) : (
          <div className="flex flex-col">
            <span className={cn(task.completed ? "line-through text-muted-foreground" : "")}>{task.text}</span>
            {task.weather && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <Cloud size={12} />
                <span>
                  {task.weather.description}, {Math.round(task.weather.temp)}°C
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>

        {isEditing ? (
          <>
            <Button variant="ghost" size="icon" onClick={handleSave} aria-label="Save">
              <Save size={16} />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleCancel} aria-label="Cancel">
              <X size={16} />
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="icon" onClick={handleEdit} aria-label="Edit">
              <Pencil size={16} />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDelete} aria-label="Delete">
              <Trash size={16} />
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

