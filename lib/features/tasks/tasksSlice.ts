import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Task } from "./types"

interface TasksState {
  tasks: Task[]
}

// Load tasks from localStorage if available
const loadTasksFromStorage = (): Task[] => {
  if (typeof window !== "undefined") {
    const savedTasks = localStorage.getItem("tasks")
    if (savedTasks) {
      try {
        return JSON.parse(savedTasks)
      } catch (e) {
        console.error("Failed to parse tasks from localStorage", e)
      }
    }
  }
  return []
}

// Save tasks to localStorage
const saveTasksToStorage = (tasks: Task[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }
}

const initialState: TasksState = {
  tasks: [],
}

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    loadTasks: (state) => {
      state.tasks = loadTasksFromStorage()
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload)
      saveTasksToStorage(state.tasks)
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex((task) => task.id === action.payload.id)
      if (index !== -1) {
        state.tasks[index] = action.payload
        saveTasksToStorage(state.tasks)
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload)
      saveTasksToStorage(state.tasks)
    },
    clearTasks: (state) => {
      state.tasks = []
      saveTasksToStorage(state.tasks)
    },
  },
})

export const { loadTasks, addTask, updateTask, deleteTask, clearTasks } = tasksSlice.actions
export default tasksSlice.reducer

