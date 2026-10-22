import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./DetalheItem.css"
import {
  mensagemErro,
} from "../services/api";

import {
  buscarItem,
  nomeCampo,
  marcarItemDevolvido,
  excluirItem as excluirItemAPI,
} from "../services/itensService";

function DetalheItem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [destinatario, setDestinatario] = useState("");
  const [devolvendo, setDevolvendo] = useState(false);

  const [confirmarExclusao, setConfirmarExclusao] =
    useState(false);
  const [excluindo, setExcluindo] = useState(false);

  const carregarItem = useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      const dados = await buscarItem(id);
      setItem(dados);
    } catch (erroApi) {
      setItem(null);
      setErro(mensagemErro(erroApi));
    } finally {
      setCarregando(false);
    }
  }, [id]);

  useEffect(() => {
    carregarItem();
  }, [carregarItem]);

  async function marcarComoDevolvido(evento) {
    evento.preventDefault();

    if (!destinatario.trim()) {
      setErro("Informe o nome de quem recebeu o item.");
      return;
    }

    setDevolvendo(true);
    setErro("");

    try {
      await marcarItemDevolvido(
        id,
        destinatario.trim()
      );

      setDestinatario("");
      await carregarItem();
    } catch (erroApi) {
      setErro(mensagemErro(erroApi));
    } finally {
      setDevolvendo(false);
    }
  }

  async function excluirItem() {
    setExcluindo(true);
    setErro("");

    try {
      await excluirItemAPI(id);

      navigate("/");
    } catch (erroApi) {
      setErro(mensagemErro(erroApi));
    } finally {
      setExcluindo(false);
    }
  }

  if (carregando) {
    return (
      <section>
        <p>Carregando detalhes do item...</p>
      </section>
    );
  }

  if (!item) {
    return (
      <section>
        <h1>Não foi possível encontrar o item</h1>

        <p role="alert">
          {erro || "Item não encontrado."}
        </p>

        <Link to="/">
          Voltar para a página inicial
        </Link>
      </section>
    );
  }

  const statusNormalizado = String(item?.status ?? "")
    .trim()
    .toLowerCase();

  return (
    <section className="pagina-detalhe">
      <Link to="/" className="voltar-detalhe">
        ← Voltar
      </Link>

      <div className="resumo-item">

        <div className="resumo-item-conteudo">
          <h1>{item.nome}</h1>

          <p className={`status-item status-${item.status}`}>
            <strong>{item.status}</strong>
          </p>
        </div>
      </div>

      {erro && <p role="alert">{erro}</p>}

      <dl className="dados-item">
        <div className="linha-dado">
          <dt>Descrição:</dt>
          <dd>{nomeCampo(item.descricao)}</dd>
        </div>

        <div className="linha-dado">
          <dt>Categoria:</dt>
          <dd>{nomeCampo(item.categoria)}</dd>
        </div>

        <div className="linha-dado">
          <dt>Local:</dt>
          <dd>{nomeCampo(item.local)}</dd>
        </div>

        <div className="linha-dado">
          <dt>Encontrado em:</dt>
          <dd>{nomeCampo(item.data_encontrado)}</dd>
        </div>

        <div className="linha-dado">
          <dt>Devolvido para:</dt>
          <dd>{nomeCampo(item.devolvido_para)}</dd>
        </div>
      </dl>

      <div className="acoes-item">
        <Link to={`/editar/${item.id}`}>
          Editar
        </Link>

        <button
          type="button"
          onClick={() => setConfirmarExclusao(true)}
        >
          Excluir
        </button>
      </div>

      {confirmarExclusao && (
        <section className="confirmacao-exclusao">
          <h2>Confirmar exclusão</h2>

          <p>Tem certeza que deseja excluir?</p>

          <button
            type="button"
            onClick={excluirItem}
            disabled={excluindo}
          >
            {excluindo ? "Excluindo..." : "Excluir"}
          </button>

          <button
            type="button"
            onClick={() => setConfirmarExclusao(false)}
            disabled={excluindo}
          >
            Cancelar
          </button>
        </section>
      )}

      {statusNormalizado === "aguardando" && (
        <section className="devolucao-item">
          <h2>Marcar como devolvido</h2>

          <form onSubmit={marcarComoDevolvido}>
            <label htmlFor="devolvido_para">
              <span className="texto-acessivel">
                Nome de quem recebeu
              </span>

              <input
                id="devolvido_para"
                type="text"
                placeholder="Nome de quem recebeu"
                value={destinatario}
                onChange={(evento) =>
                  setDestinatario(evento.target.value)
                }
                required
              />
            </label>

            <button type="submit" disabled={devolvendo}>
              {devolvendo ? "Salvando..." : "Confirmar"}
            </button>
          </form>
        </section>
      )}
    </section>
  );
}

export default DetalheItem;