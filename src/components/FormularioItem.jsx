import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import api from "../services/api";

import {
  mensagemErro,
  normalizarOpcoes,
  valorCampo,
} from "../utils/apiHelpers";

const formularioVazio = {
  nome: "",
  descricao: "",
  categoria: "",
  local: "",
  data_encontrado: new Date()
    .toISOString()
    .slice(0, 10),
};

function FormularioItem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const editando = Boolean(id);

  const [form, setForm] = useState(formularioVazio);

  const [categorias, setCategorias] = useState([]);
  const [locais, setLocais] = useState([]);

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [erro, setErro] = useState("");
  const [erroOpcoes, setErroOpcoes] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarFormulario() {
      setCarregando(true);
      setErro("");
      setErroOpcoes("");

      // Carrega categoria e local independentemente.
      const [resultadoCategorias, resultadoLocais] =
        await Promise.allSettled([
          api.get("/categorias"),
          api.get("/locais"),
        ]);

      if (!ativo) return;

      if (resultadoCategorias.status === "fulfilled") {
        setCategorias(
          normalizarOpcoes(
            resultadoCategorias.value.data,
            "categorias"
          )
        );
      } else {
        setErroOpcoes(
          "Não foi possível carregar as categorias."
        );
      }

      if (resultadoLocais.status === "fulfilled") {
        setLocais(
          normalizarOpcoes(
            resultadoLocais.value.data,
            "locais"
          )
        );
      } else {
        setErroOpcoes(
          "Não foi possível carregar os locais."
        );
      }

      // Na edição, busca os dados existentes.
      if (id) {
        try {
          const resposta = await api.get(`/itens/${id}`);

          if (!ativo) return;

          const item = resposta.data?.item ?? resposta.data;

          setForm({
            nome: item.nome ?? "",
            descricao: item.descricao ?? "",
            categoria: valorCampo(item.categoria),
            local: valorCampo(item.local),
            data_encontrado: valorCampo(
              item.data_encontrado
            ).slice(0, 10),
          });
        } catch (erroApi) {
          if (ativo) {
            setErro(mensagemErro(erroApi));
          }
        }
      }

      if (ativo) {
        setCarregando(false);
      }
    }

    carregarFormulario();

    return () => {
      ativo = false;
    };
  }, [id]);

  function alterarCampo(evento) {
    const { name, value } = evento.target;

    setForm((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  async function salvar(evento) {
    evento.preventDefault();

    setSalvando(true);
    setErro("");

    const dados = {
      nome: form.nome.trim(),
      descricao: form.descricao.trim(),
      categoria: form.categoria,
      local: form.local,
      data_encontrado: form.data_encontrado,
    };

    try {
      let resposta;

      if (editando) {
        resposta = await api.put(
          `/itens/${id}`,
          dados
        );
      } else {
        resposta = await api.post("/itens", dados);
      }

      const itemSalvo =
        resposta.data?.item ?? resposta.data;

      if (editando) {
        navigate(`/item/${id}`);
      } else if (itemSalvo?.id != null) {
        navigate(`/item/${itemSalvo.id}`);
      } else {
        navigate("/");
      }
    } catch (erroApi) {
      setErro(mensagemErro(erroApi));
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return <p>Carregando formulário...</p>;
  }

  if (erro && editando) {
    return (
      <section>
        <h1>Não foi possível abrir o item</h1>
        <p role="alert">{erro}</p>
        <Link to="/">Voltar para a página inicial</Link>
      </section>
    );
  }

  return (
    <section className="pagina-formulario">
      <h1>
        {editando ? "Editar item" : "Novo item"}
      </h1>

      {erroOpcoes && (
        <p role="alert">{erroOpcoes}</p>
      )}

      {erro && (
        <p role="alert">{erro}</p>
      )}

      <form onSubmit={salvar}>
        <label htmlFor="nome">
          Nome
          <input
            id="nome"
            name="nome"
            type="text"
            value={form.nome}
            onChange={alterarCampo}
            required
          />
        </label>

        <label htmlFor="descricao">
          Descrição
          <textarea
            id="descricao"
            name="descricao"
            value={form.descricao}
            onChange={alterarCampo}
            required
          />
        </label>

        <label htmlFor="categoria-form">
          Categoria
          <select
            id="categoria-form"
            name="categoria"
            value={form.categoria}
            onChange={alterarCampo}
            required
          >
            <option value="">Selecione uma categoria</option>

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

        <label htmlFor="local-form">
          Local
          <select
            id="local-form"
            name="local"
            value={form.local}
            onChange={alterarCampo}
            required
          >
            <option value="">Selecione um local</option>

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

        <label htmlFor="data_encontrado">
          Data em que foi encontrado
          <input
            id="data_encontrado"
            name="data_encontrado"
            type="date"
            value={form.data_encontrado}
            onChange={alterarCampo}
            required
          />
        </label>

        <div className="acoes-formulario">
          <button
            type="submit"
            disabled={salvando}
          >
            {salvando ? "Salvando..." : "Salvar"}
          </button>

          <Link to={editando && id ? `/item/${id}` : "/"}>
            Cancelar
          </Link>
        </div>
      </form>
    </section>
  );
}

export default FormularioItem;