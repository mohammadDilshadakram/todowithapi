"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import type { RootState } from "@/lib/store"
import TaskInput from "@/components/task-input"
import TaskList from "@/components/task-list"
import WeatherWidget from "@/components/weather-widget"
import { loadTasks } from "@/lib/features/tasks/tasksSlice"

export default function Home() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  const router = useRouter()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    } else {
      dispatch(loadTasks())
    }
  }, [isAuthenticated, router, dispatch])

  if (!isAuthenticated) {
    return null
  }

  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-3/4">
          <h1 className="text-3xl font-bold mb-6">Task Manager</h1>
          <TaskInput />
          <TaskList />
        </div>
        <div className="w-full md:w-1/4">
          <WeatherWidget />
        </div>
      </div>
    </main>
  )
}

