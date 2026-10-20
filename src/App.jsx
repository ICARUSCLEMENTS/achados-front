import { Link, Route, Routes } from "react-router-dom";
import Cabecalho from "./components/Cabecalho";
import Home from "./pages/Home";
import DetalheItem from "./pages/DetalheItem";
import FormularioItem from "./components/FormularioItem";
import "./App.css";

function App() {
  return (
    <div className="app-shell">
      <Cabecalho />

      <main className="conteudo-principal">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/item/:id"
            element={<DetalheItem />}
          />

          <Route
            path="/novo"
            element={<FormularioItem />}
          />

          <Route
            path="/editar/:id"
            element={<FormularioItem />}
          />

          <Route
            path="*"
            element={
              <section>
                <h1>Página não encontrada</h1>
                <Link to="/">Voltar para a página inicial</Link>
              </section>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;