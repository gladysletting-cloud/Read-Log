import { Routes, Route, Navigate } from "react-router-dom";
import Login from './Pages/Login'
import Library from './Pages/Library'
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

    </Routes>
  )
}
export default App;