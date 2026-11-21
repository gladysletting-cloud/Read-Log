import { Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/Login'
import Library from './pages/Library'
import Search from "./pages/Search";
import ProtectedRoute from "./components/ProtectedRoute";

function App(){
  return(
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/library"
        element={
          <ProtectedRoute>
            <Library />
          </ProtectedRoute>
          }
      />
      <Route 
        path="/search" 
        element={
        <ProtectedRoute>
          <Search />
        </ProtectedRoute>
       } 
      />

    </Routes>
  )
}
export default App;