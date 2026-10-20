import { Link } from "react-router-dom";
import { nomeCampo } from "../utils/apiHelpers";

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
                    Categoria: {nomeCampo(item.categoria)}
                </p>

                <p>
                    Local: {nomeCampo(item.local)}
                </p>

                <p>
                    Status: <span>{status}</span>
                </p>
            </div>

            <Link to={`/item/${item.id}`}>
                Ver detalhes
            </Link>
        </article>
    );
}

export default ItemCard;