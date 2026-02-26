import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function Dashboard() {
  
  const [stats, setStats] = useState({ totalVehicles: 0, totalMaintenances: 0, totalRevenue: 0, chartData: [] });

  useEffect(() => {
    fetch('http://localhost:3001/api/dashboard')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));
  }, []);

  const formatCurrency = (value) => {
    return (value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

  return (
    <div className="container">
      <h2 className="page-title">Visão Geral do PitStop</h2>
      
      {/* Grid com 3 Cards (adicionei um estilo para eles se ajustarem bem lado a lado) */}
      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        
        {/* Card 1: Veículos */}
        <Link to="/relatorio-veiculos" className="dash-card" style={{ textDecoration: 'none' }}>
          <div className="dash-icon">🚗</div>
          <div className="dash-info">
            <h3>{stats.totalVehicles}</h3>
            <p>Veículos Cadastrados</p>
          </div>
        </Link>

        {/* Card 2: Revisões */}
        <Link to="/vehicles" className="dash-card" style={{ textDecoration: 'none' }}>
          <div className="dash-icon">🔧</div>
          <div className="dash-info">
            <h3>{stats.totalMaintenances}</h3>
            <p>Revisões Registradas</p>
          </div>
        </Link>

{/* Card 3: NOVO! Faturamento / Custo Total */}
       <div className="dash-card highlight" style={{ cursor: 'default' }}>
          <div className="dash-icon">💰</div>
          <div className="dash-info">
            {/* Trocamos o wordBreak por whiteSpace: 'nowrap' e reduzimos para 1.3rem */}
            <h3 style={{ color: '#059669', fontSize: '1.3rem', whiteSpace: 'nowrap' }}>
              {formatCurrency(stats.totalRevenue)}
            </h3>
            <p>Movimentação Total</p>
          </div>
        </div>
      </div> 

      {/* --- SEÇÃO DO GRÁFICO --- */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '30px', marginTop: '40px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid var(--border)' }}>
        <h3 style={{ textAlign: 'center', color: 'var(--secondary)', marginBottom: '30px', fontSize: '1.3rem' }}>Serviços Mais Realizados</h3>
        
        {stats.chartData && stats.chartData.length > 0 ? (
          <div style={{ height: 350, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 14 }} />
                <YAxis stroke="#64748b" allowDecimals={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                />
                {/* As barras do gráfico com cantos arredondados */}
                <Bar dataKey="value" name="Quantidade" radius={[6, 6, 0, 0]}>
                  {stats.chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#64748b' }}>Ainda não há dados suficientes para gerar o gráfico.</p>
        )}
      </div>

      {/* Botão de Ação */}
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <Link to="/vehicles" className="btn-primary" style={{ textDecoration: 'none', padding: '15px 30px', fontSize: '1.1rem' }}>
          Acessar Meus Veículos
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
