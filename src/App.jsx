import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<main className="container"><h1>Gestión Médica</h1></main>} />
      </Routes>
    </BrowserRouter>
  );
}
