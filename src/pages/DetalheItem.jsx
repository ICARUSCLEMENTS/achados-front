import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import api from "../services/api";
import {
  mensagemErro,
  nomeCampo,
} from "../utils/apiHelpers";

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
      const resposta = await api.get(`/itens/${id}`);

      setItem(
        resposta.data?.item ?? resposta.data
      );
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
      await api.patch(
        `/itens/${id}/devolver`,
        {
          devolvido_para: destinatario.trim(),
        }
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
      await api.delete(`/itens/${id}`);

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

  return (
    <section className="pagina-detalhe">
      <Link to="/">← Voltar</Link>

      <h1>{item.nome}</h1>

      {erro && (
        <p role="alert">{erro}</p>
      )}

      <p>
        Status: <strong>{item.status}</strong>
      </p>

      <dl className="dados-item">
        <dt>Descrição</dt>
        <dd>{nomeCampo(item.descricao)}</dd>

        <dt>Categoria</dt>
        <dd>{nomeCampo(item.categoria)}</dd>

        <dt>Local</dt>
        <dd>{nomeCampo(item.local)}</dd>

        <dt>Encontrado em</dt>
        <dd>{nomeCampo(item.data_encontrado)}</dd>

        <dt>Devolvido para</dt>
        <dd>{nomeCampo(item.devolvido_para)}</dd>

        {item.data_devolucao && (
          <>
            <dt>Data da devolução</dt>
            <dd>{item.data_devolucao}</dd>
          </>
        )}
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

          <p>
            Tem certeza de que deseja excluir este item?
          </p>

          <button
            type="button"
            onClick={excluirItem}
            disabled={excluindo}
          >
            {excluindo ? "Excluindo..." : "Confirmar exclusão"}
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

      {item.status === "aguardando" && (
        <section className="devolucao-item">
          <h2>Marcar como devolvido</h2>

          <form onSubmit={marcarComoDevolvido}>
            <label htmlFor="devolvido_para">
              Nome de quem recebeu
              <input
                id="devolvido_para"
                type="text"
                value={destinatario}
                onChange={(evento) =>
                  setDestinatario(evento.target.value)
                }
                required
              />
            </label>

            <button
              type="submit"
              disabled={devolvendo}
            >
              {devolvendo
                ? "Registrando..."
                : "Confirmar devolução"}
            </button>
          </form>
        </section>
      )}
    </section>
  );
}

export default DetalheItem;