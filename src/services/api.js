import axios from "axios";

const api = axios.create({
    baseURL: "https://api-achados.jefersonqueiroga.com.br",
    headers: {
        "X-API-Key": import.meta.env.VITE_API_KEY,
    },
});

// Função para tratar erros retornados pela API
export function mensagemErro(erro) {
    const detalhe = erro?.response?.data?.detail;

    if (typeof detalhe === "string") {
        return detalhe;
    }

    if (Array.isArray(detalhe)) {
        return detalhe
            .map((item) =>
                typeof item === "string"
                    ? item
                    : item?.msg ?? JSON.stringify(item)
            )
            .join(" | ");
    }

    return (
        erro?.response?.data?.message ||
        erro?.message ||
        "Ocorreu um erro inesperado."
    );
}

export default api;