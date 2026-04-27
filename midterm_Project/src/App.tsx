import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Hub from './pages/Hub'
import Adventure from './pages/Adventure'
import StoryEvent from './pages/StoryEvent'
import { useAuthStore } from './store/useAuthStore'
import './index.css'

function App() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated())

  return (
    <BrowserRouter>
      <Routes>
        {/* Landing/Home only seen if not logged in, or as entry */}
        <Route path="/" element={isAuthenticated ? <Hub /> : <Landing />} />

        {/* Auth routes */}
        <Route path="/auth" element={!isAuthenticated ? <Auth /> : <Navigate to="/" />} />

        {/* Protected game routes will go here */}
        <Route
          path="/adventure"
          element={isAuthenticated ? <Adventure /> : <Navigate to="/" />}
        />
        <Route
          path="/story/:locationId"
          element={isAuthenticated ? <StoryEvent /> : <Navigate to="/" />}
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App
