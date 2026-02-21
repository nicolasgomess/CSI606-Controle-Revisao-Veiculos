import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import VehicleList from './components/VehicleList';
import VehicleForm from './components/VehicleForm';
import MaintenanceSystem from './components/MaintenanceSystem';
import VehicleReport from './components/VehicleReport';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="main-content">
        <Routes>
       <Route path="/" element={<Dashboard />} />
       <Route path="/relatorio-veiculos" element={<VehicleReport />} />
       <Route path="/vehicles" element={<VehicleList />} />
       <Route path="/add" element={<VehicleForm />} />
       <Route path="/vehicle/:id" element={<MaintenanceSystem />} />
     </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;