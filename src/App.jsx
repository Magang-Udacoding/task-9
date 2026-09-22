import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Items from './pages/Items.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route
      path="/login" element={<Login/>} /> 
      
      <Route
      path="/items" element={
      <PrivateRoute>
        <Items/>
      </PrivateRoute>
      } 
      /> 
      
      <Route
      path="*" element={ <Navigate to="/login" replace /> } /> 
      
    </Routes>
    </BrowserRouter>
  );
}

export default App;
