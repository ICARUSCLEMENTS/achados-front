import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { mensagemErro } from "../services/api";
import { buscarPerfil } from "../services/perfilService";
import "./cabecalho.css"

function Cabecalho() {
    const [aluno, setAluno] = useState(null);
    const [erro, setErro] = useState("");

    useEffect(() => {
        async function carregarAluno() {
            try {
                const dados = await buscarPerfil();
                setAluno(dados);
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