import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function VehicleForm() {
  const navigate = useNavigate();
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [plate, setPlate] = useState('');
  const [mileage, setMileage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const vehicleData = { model, year, plate, mileage };

    try {
      const response = await fetch('http://localhost:3001/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicleData),
      });

      if (response.ok) {
        alert('Veículo cadastrado com sucesso!');
        navigate('/'); // Volta para a tela inicial automaticamente
      } else {
        alert('Erro ao cadastrar.');
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  return (
    <div className="container">
      <h2 className="page-title">Cadastrar Novo Veículo</h2>
      <form onSubmit={handleSubmit} className="styled-form">
        <label>Modelo</label>
        <input 
          type="text" 
          value={model} 
          onChange={(e) => setModel(e.target.value)} 
          placeholder="Ex: Chevrolet Cruze"
          required 
        />

        <label>Ano</label>
        <input 
          type="number" 
          value={year} 
          onChange={(e) => setYear(e.target.value)} 
          placeholder="Ex: 2021"
          required 
        />

        <label>Placa</label>
        <input 
          type="text" 
          value={plate} 
          onChange={(e) => setPlate(e.target.value)} 
          placeholder="Ex: ABC-1234"
          required 
        />

        <label>Quilometragem</label>
        <input 
          type="number" 
          value={mileage} 
          onChange={(e) => setMileage(e.target.value)} 
          placeholder="Ex: 40000"
          required 
        />

        <button type="submit" className="btn-primary">Salvar Veículo</button>
      </form>
    </div>
  );
}

export default VehicleForm;