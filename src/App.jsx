import { Routes, Route, Navigate } from "react-router-dom";
import Login from './Pages/Login'
import Library from './Pages/Library'

function App(){
  return(
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/library" element={<Library />} />
    </Routes>
  )
}
export default App;