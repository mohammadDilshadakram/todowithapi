import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

interface WeatherData {
  currentConditions: {
    temp: number
    humidity: number
    windspeed: number
    conditions: string
    icon: string
  }
  address: string
  resolvedAddress: string
  timezone: string
  description: string
  days: Array<{
    datetime: string
    temp: number
    conditions: string
    icon: string
  }>
}

interface WeatherState {
  data: WeatherData | null
  loading: boolean
  error: string | null
}

interface FetchWeatherParams {
  location: string
}

export const fetchWeather = createAsyncThunk("weather/fetchWeather", async ({ location }: FetchWeatherParams) => {
  // Using the provided API key
  const apiKey = "V3G6L6PKW52LEJEA9MUGFKG6W"
  const response = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=${apiKey}&contentType=json`,
  )

  if (!response.ok) {
    throw new Error("Failed to fetch weather data")
  }

  return response.json() as Promise<WeatherData>
})

const initialState: WeatherState = {
  data: null,
  loading: false,
  error: null,
}

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWeather.fulfilled, (state, action: PayloadAction<WeatherData>) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch weather data"
      })
  },
})

export default weatherSlice.reducer

