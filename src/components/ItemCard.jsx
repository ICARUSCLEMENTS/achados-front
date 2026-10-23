import { Link } from "react-router-dom";
import { nomeCampo } from "../services/itensService";
import "./ItemCard.css"

function ItemCard({ item }) {
    const status =
        item.status === "devolvido"
            ? "devolvido"
            : "aguardando";

    return (
        <article className={`item-card status-${status}`}>
            <div className="item-card-conteudo">
                <h2>{item.nome}</h2>

                <p>{item.descricao || "Sem descrição."}</p>

                <p>
                    Categoria:{" "}
                    {nomeCampo(
                        item,
                        "categoria_nome",
                        "nome_categoria",
                        "categoria",
                        "category_name",
                        "category"
                    ) || "Não informada"}
                </p>

                <p>
                    Local:{" "}
                    {nomeCampo(
                        item,
                        "local_nome",
                        "nome_local",
                        "local",
                        "location_name",
                        "location"
                    ) || "Não informado"}
                </p>

                <p className="statusp">
                    <span>{status}</span>
                </p>
                <button>
                    <Link to={`/item/${item.id}`}>
                        Ver detalhes
                    </Link>
                </button>
            </div>

        </article>
    );
}

export default ItemCard;