export function extrairLista(dados, chave) {
  if (Array.isArray(dados)) {
    return dados;
  }

  if (Array.isArray(dados?.[chave])) {
    return dados[chave];
  }

  return [];
}

export function normalizarOpcoes(dados, chave) {
  return extrairLista(dados, chave)
    .map((item) => {
      if (typeof item === "string" || typeof item === "number") {
        return {
          value: String(item),
          label: String(item),
        };
      }

      const valor =
        item?.valor ??
        item?.value ??
        item?.nome ??
        item?.categoria ??
        item?.local ??
        item?.id;

      const rotulo =
        item?.nome ??
        item?.label ??
        item?.categoria ??
        item?.local ??
        valor;

      if (valor == null || rotulo == null) {
        return null;
      }

      return {
        value: String(valor),
        label: String(rotulo),
      };
    })
    .filter(Boolean);
}

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

export function nomeCampo(valor) {
  if (valor == null || valor === "") {
    return "Não informado";
  }

  if (typeof valor === "object") {
    return String(
      valor.nome ??
      valor.label ??
      valor.valor ??
      valor.value ??
      valor.id ??
      "Não informado"
    );
  }

  return String(valor);
}

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