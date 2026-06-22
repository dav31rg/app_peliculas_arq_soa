import './App.css';
import Home from './pages/Home';

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <span className="app-logo">TMBD - SOA</span>
        <span className="app-badge">SOA + WSO2</span>
      </header>
      <main>
        <Home />
      </main>
    </div>
  );
}
