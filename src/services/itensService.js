import api from "./api";

// Extrai uma lista das respostas da API
function extrairLista(dados, chave) {
    if (Array.isArray(dados)) {
        return dados;
    }

    if (Array.isArray(dados?.[chave])) {
        return dados[chave];
    }

    return [];
}

// Transforma categorias e locais em opções para os selects
export function normalizarOpcoes(dados) {
    const lista = Array.isArray(dados)
        ? dados
        : dados?.categorias ??
        dados?.locais ??
        dados?.items ??
        dados?.results ??
        dados?.data ??
        [];

    if (!Array.isArray(lista)) {
        return [];
    }

    return lista.map((item) => {
        if (typeof item === "string") {
            return { value: item, label: item };
        }

        return {
            value: item.id ?? item.valor ?? item.nome ?? item.name ?? "",
            label:
                item.nome ??
                item.name ??
                item.descricao ??
                item.label ??
                String(item.id ?? ""),
        };
    });
}

// Extrai o valor de um campo para preencher o formulário
export function valorCampo(valor) {
    if (valor && typeof valor === "object") {
        return String(
            valor.nome ??
            valor.valor ??
            valor.value ??
            valor.id ??
            ""
        );
    }

    return String(valor ?? "");
}

export function nomeCampo(item, ...nomes) {
    for (const nome of nomes) {
        const valor = item?.[nome];

        if (valor !== undefined && valor !== null && valor !== "") {
            return valor;
        }
    }

    return "";
}

// GET - Listar itens com filtros opcionais
export async function listarItens(filtros = {}) {
    const params = {};

    if (filtros.busca?.trim()) {
        params.busca = filtros.busca.trim();
    }

    if (filtros.status) {
        params.status = filtros.status;
    }

    if (filtros.categoria) {
        params.categoria = filtros.categoria;
    }

    if (filtros.local) {
        params.local = filtros.local;
    }

    const resposta = await api.get("/itens", {
        params,
    });

    return extrairLista(resposta.data, "itens");
}

// GET - Buscar os detalhes de um item
export async function buscarItem(id) {
    const resposta = await api.get(`/itens/${id}`);

    return resposta.data?.item ?? resposta.data;
}

// GET - Listar categorias
export async function listarCategorias() {
    const resposta = await api.get("/categorias");

    return normalizarOpcoes(
        resposta.data,
        "categorias"
    );
}

// GET - Listar locais
export async function listarLocais() {
    const resposta = await api.get("/locais");

    return normalizarOpcoes(
        resposta.data,
        "locais"
    );
}

// POST - Cadastrar um item
export async function criarItem(item) {
    const resposta = await api.post("/itens", item);

    return resposta.data?.item ?? resposta.data;
}

// PUT - Atualizar um item
export async function atualizarItem(id, item) {
    const resposta = await api.put(
        `/itens/${id}`,
        item
    );

    return resposta.data?.item ?? resposta.data;
}

// PATCH - Marcar um item como devolvido
export async function marcarItemDevolvido(
    id,
    devolvidoPara
) {
    const resposta = await api.patch(
        `/itens/${id}/devolver`,
        {
            devolvido_para: devolvidoPara,
        }
    );

    return resposta.data;
}

// DELETE - Excluir um item
export async function excluirItem(id) {
    const resposta = await api.delete(`/itens/${id}`);

    return resposta.data;
}