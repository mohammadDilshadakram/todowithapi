"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchWeather } from "@/lib/features/weather/weatherSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { RootState, AppDispatch } from "@/lib/store"
import { Cloud, CloudRain, Sun, Thermometer, CloudLightning, CloudSnow, CloudFog } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function WeatherWidget() {
  const dispatch = useDispatch<AppDispatch>()
  const { data, loading, error } = useSelector((state: RootState) => state.weather)
  const [location, setLocation] = useState("Kolkata")
  const [inputLocation, setInputLocation] = useState("Kolkata")

  useEffect(() => {
    // Fetch weather for the location
    dispatch(fetchWeather({ location }))
  }, [dispatch, location])

  const handleLocationChange = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputLocation.trim()) {
      setLocation(inputLocation.trim())
    }
  }

  const getWeatherIcon = (iconCode: string) => {
    switch (iconCode) {
      case "clear-day":
      case "clear-night":
        return <Sun className="h-12 w-12 text-yellow-500" />
      case "rain":
        return <CloudRain className="h-12 w-12 text-blue-500" />
      case "snow":
        return <CloudSnow className="h-12 w-12 text-blue-200" />
      case "sleet":
        return <CloudSnow className="h-12 w-12 text-blue-300" />
      case "wind":
        return <Cloud className="h-12 w-12 text-gray-400" />
      case "fog":
        return <CloudFog className="h-12 w-12 text-gray-300" />
      case "cloudy":
      case "partly-cloudy-day":
      case "partly-cloudy-night":
        return <Cloud className="h-12 w-12 text-gray-500" />
      case "thunderstorm":
        return <CloudLightning className="h-12 w-12 text-purple-500" />
      default:
        return <Cloud className="h-12 w-12 text-gray-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Thermometer className="h-5 w-5" />
          <span>Weather</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLocationChange} className="mb-4 flex gap-2">
          <Input
            value={inputLocation}
            onChange={(e) => setInputLocation(e.target.value)}
            placeholder="Enter location"
            className="flex-1"
          />
          <Button type="submit" size="sm">
            Update
          </Button>
        </form>

        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-12 rounded-full mx-auto" />
            <Skeleton className="h-4 w-24 mx-auto" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">Unable to load weather data</p>
            <p className="text-xs text-muted-foreground mt-2">Please check the location name and try again</p>
          </div>
        ) : data ? (
          <div className="text-center">
            <div className="flex justify-center mb-2">
              {data.currentConditions.icon && getWeatherIcon(data.currentConditions.icon)}
            </div>
            <h3 className="text-2xl font-bold">{Math.round(data.currentConditions.temp)}°C</h3>
            <p className="text-muted-foreground capitalize">{data.currentConditions.conditions}</p>
            <p className="text-sm mt-2">{data.resolvedAddress}</p>
            <p className="text-xs text-muted-foreground mt-1">{data.description}</p>

            <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
              <div className="text-center">
                <p className="text-muted-foreground">Humidity</p>
                <p className="font-medium">{data.currentConditions.humidity}%</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground">Wind</p>
                <p className="font-medium">{Math.round(data.currentConditions.windspeed)} km/h</p>
              </div>
            </div>

            {data.days && data.days.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium mb-2">3-Day Forecast</p>
                <div className="grid grid-cols-3 gap-1">
                  {data.days.slice(0, 3).map((day, index) => (
                    <div key={index} className="text-center">
                      <p className="text-xs">
                        {new Date(day.datetime).toLocaleDateString("en-US", { weekday: "short" })}
                      </p>
                      <div className="flex justify-center my-1">{getWeatherIcon(day.icon)}</div>
                      <p className="text-xs font-medium">{Math.round(day.temp)}°C</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground mt-4">Weather is saved with your tasks to track conditions</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

