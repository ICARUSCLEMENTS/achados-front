import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./cabecalho.css"
import { mensagemErro } from "../utils/apiHelpers";

function Cabecalho() {
    const [aluno, setAluno] = useState(null);
    const [erro, setErro] = useState("");

    useEffect(() => {
        async function carregarAluno() {
            try {
                const resposta = await api.get("/eu");
                setAluno(resposta.data);
            } catch (erroApi) {
                setErro(mensagemErro(erroApi));
            }
        }

        carregarAluno();
    }, []);

    return (
        <header className="cabecalho">
            <Link to="/" className="marca">
                Achados e Perdidos
            </Link>

            <div className="informacoes-aluno">
                {aluno ? (
                    <span>
                        Olá,{" "}
                        {aluno.nome ??
                            aluno.name ??
                            "aluno"}
                    </span>
                ) : erro ? (
                    <span role="alert">
                        Não foi possível carregar o perfil: {erro}
                    </span>
                ) : (
                    <span>Carregando perfil...</span>
                )}
            </div>
        </header>
    );
}

export default Cabecalho;