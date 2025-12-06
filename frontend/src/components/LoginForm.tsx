import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import useTokenStore from "../store/TokenStore";
import useLoginStore from "../store/LoginStore";
import useApi from "../hooks/useApi"; // <--- Importa o hook
import { useEffect } from "react";

// Validação do formulário
const schema = z.object({
  username: z.string().min(1, "O nome de usuário é obrigatório"),
  password: z.string().min(1, "A senha é obrigatória"),
});

type LoginFormData = z.infer<typeof schema>;

const LoginForm = () => {
  const navigate = useNavigate();
  const setTokenResponse = useTokenStore((state) => state.setTokenResponse);
  const { mensagem, setMensagem } = useLoginStore();

  // Instancia o hook para a rota de login
  // Usamos 'any' aqui porque o retorno (Token) é diferente da entrada (LoginFormData)
  const { cadastrar } = useApi<any>("/autenticacao/login");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    // Pode limpar mensagem ao montar, se desejar
  }, []);

  const mutation = useMutation({
    mutationFn: (data: LoginFormData) => {
      // Usa o método cadastrar do useApi (que faz um POST)
      return cadastrar(data);
    },
    onSuccess: (data) => {
      // Salva o token e redireciona
      setTokenResponse(data);
      setMensagem(""); 
      navigate("/");
    },
    onError: (error) => {
      // O useApi lança erro se não for 200 OK
      setMensagem("Usuário ou senha inválidos.");
      console.error(error);
    },
  });

  const onSubmit = (data: LoginFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="card shadow-sm p-4" style={{ maxWidth: "400px", width: "100%" }}>
      <h3 className="text-center mb-4">Login</h3>

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
        <Link to="/cadastro-usuario" className="text-decoration-none">
          Cadastre-se
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;