export interface WeatherInfo {
  temp: number
  description: string
  icon: string
}

export interface Task {
  id: string
  text: string
  completed: boolean
  priority: "low" | "medium" | "high"
  weather: WeatherInfo | null
}

