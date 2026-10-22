import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css"
import api from "../services/api";
import ItemCard from "../components/ItemCard";
import {
  listarItens,
  listarCategorias,
  listarLocais,
} from "../services/itensService";
import { mensagemErro } from "../services/api";

function Home() {
  const [itens, setItens] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [locais, setLocais] = useState([]);

  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState("");
  const [categoria, setCategoria] = useState("");
  const [local, setLocal] = useState("");

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [erroFiltros, setErroFiltros] = useState("");

  // Carrega as opções dos filtros.
  useEffect(() => {
    let ativo = true;

    async function carregarFiltros() {
      try {
        const [dadosCategorias, dadosLocais] =
          await Promise.all([
            listarCategorias(),
            listarLocais(),
          ]);

        if (!ativo) return;

        setCategorias(dadosCategorias);
        setLocais(dadosLocais);
      } catch (erroApi) {
        if (ativo) {
          setErroFiltros(mensagemErro(erroApi));
        }
      }
    }

    carregarFiltros();

    return () => {
      ativo = false;
    };
  }, []);

  // Busca os itens sempre que um filtro muda.
  useEffect(() => {
    let ativo = true;

    async function carregarItens() {
      setCarregando(true);
      setErro("");

      try {
        const dados = await listarItens({
          busca,
          status,
          categoria,
          local,
        });

        if (ativo) {
          setItens(dados);
        }
      } catch (erroApi) {
        if (ativo) {
          setErro(mensagemErro(erroApi));
          setItens([]);
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarItens();

    return () => {
      ativo = false;
    };
  }, [busca, status, categoria, local]);

  return (
    <section className="pagina-inicial">
      <div className="titulo-pagina">
        <h1>Itens encontrados</h1>

        <Link to="/novo">
          + Novo item
        </Link>
      </div>

      <div className="filtros">
        <label htmlFor="busca">
          Buscar por nome ou descrição
          <input
            id="busca"
            type="search"
            value={busca}
            onChange={(evento) =>
              setBusca(evento.target.value)
            }
            placeholder="Digite o que procura..."
          />
        </label>


        <div className="selects">
          <label htmlFor="status">
            Status
            <select
              id="status"
              value={status}
              onChange={(evento) =>
                setStatus(evento.target.value)
              }
            >
              <option value="">Todos</option>
              <option value="aguardando">
                Aguardando
              </option>
              <option value="devolvido">
                Devolvido
              </option>
            </select>
          </label>

          <label htmlFor="categoria">
            Categoria
            <select
              id="categoria"
              value={categoria}
              onChange={(evento) =>
                setCategoria(evento.target.value)
              }
            >
              <option value="">Todas</option>

              {categorias.map((opcao) => (
                <option
                  key={opcao.value}
                  value={opcao.value}
                >
                  {opcao.label}
                </option>
              ))}
            </select>
          </label>

          <label htmlFor="local">
            Local
            <select
              id="local"
              value={local}
              onChange={(evento) =>
                setLocal(evento.target.value)
              }
            >
              <option value="">Todos</option>

              {locais.map((opcao) => (
                <option
                  key={opcao.value}
                  value={opcao.value}
                >
                  {opcao.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {erroFiltros && (
        <p role="alert">
          Não foi possível carregar as opções dos filtros:{" "}
          {erroFiltros}
        </p>
      )}

      {carregando && (
        <p>Carregando itens...</p>
      )}

      {!carregando && erro && (
        <p role="alert">
          Não foi possível carregar os itens: {erro}
        </p>
      )}

      {!carregando && !erro && itens.length === 0 && (
        <p>Nenhum item encontrado.</p>
      )}

      {!carregando && !erro && itens.length > 0 && (
        <div className="lista-itens">
          {itens.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default Home;