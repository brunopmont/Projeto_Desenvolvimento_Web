import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import useTokenStore from "../store/TokenStore";
import useLoginStore from "../store/LoginStore";
import { useEffect } from "react";

// URL do seu backend
const API_URL = "http://localhost:8080";

// Validação do formulário com Zod
const schema = z.object({
  username: z.string().min(1, "O nome de usuário é obrigatório"),
  password: z.string().min(1, "A senha é obrigatória"),
});

type LoginFormData = z.infer<typeof schema>;

const LoginForm = () => {
  const navigate = useNavigate();
  const setTokenResponse = useTokenStore((state) => state.setTokenResponse);
  
  // Pega a mensagem de erro (se houver) do LoginStore
  const { mensagem, setMensagem } = useLoginStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
  });

  // Limpa a mensagem de erro ao desmontar o componente ou ao iniciar
  useEffect(() => {
    // Opcional: limpar mensagem após alguns segundos ou manter até o usuário tentar logar
  }, []);

  const mutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await fetch(`${API_URL}/autenticacao/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        // Tenta ler a mensagem de erro do backend, se houver
        throw new Error("Usuário ou senha inválidos");
      }
      return response.json();
    },
    onSuccess: (data) => {
      // Salva o token e redireciona para a Home
      setTokenResponse(data);
      setMensagem(""); // Limpa erros anteriores
      navigate("/");
    },
    onError: (error) => {
      setMensagem(error.message);
    },
  });

  const onSubmit = (data: LoginFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="card shadow-sm p-4" style={{ maxWidth: "400px", width: "100%" }}>
      <h3 className="text-center mb-4">Login</h3>

      {/* Exibe mensagem de erro (ex: "Necessário estar autenticado") */}
      {mensagem && (
        <div className="alert alert-danger text-center" role="alert">
          {mensagem}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label className="form-label">Usuário</label>
          <input
            type="text"
            className={`form-control ${errors.username ? "is-invalid" : ""}`}
            {...register("username")}
          />
          {errors.username && (
            <div className="invalid-feedback">{errors.username.message}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Senha</label>
          <input
            type="password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            {...register("password")}
          />
          {errors.password && (
            <div className="invalid-feedback">{errors.password.message}</div>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100 mb-3"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <div className="text-center">
        <span className="text-muted">Não tem conta? </span>
        {/* Link para a página de cadastro público de usuário */}
        <Link to="/cadastro-usuario" className="text-decoration-none">
          Cadastre-se
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;