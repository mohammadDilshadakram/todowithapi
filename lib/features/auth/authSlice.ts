import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface User {
  username: string
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
}

// Load auth state from localStorage if available
const loadAuthFromStorage = (): AuthState => {
  if (typeof window !== "undefined") {
    const savedAuth = localStorage.getItem("auth")
    if (savedAuth) {
      try {
        return JSON.parse(savedAuth)
      } catch (e) {
        console.error("Failed to parse auth from localStorage", e)
      }
    }
  }
  return {
    isAuthenticated: false,
    user: null,
  }
}

// Save auth state to localStorage
const saveAuthToStorage = (auth: AuthState) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth", JSON.stringify(auth))
  }
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true
      state.user = action.payload
      saveAuthToStorage(state)
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
      saveAuthToStorage(state)
    },
    checkAuth: (state) => {
      const authState = loadAuthFromStorage()
      state.isAuthenticated = authState.isAuthenticated
      state.user = authState.user
    },
  },
})

export const { login, logout, checkAuth } = authSlice.actions
export default authSlice.reducer

