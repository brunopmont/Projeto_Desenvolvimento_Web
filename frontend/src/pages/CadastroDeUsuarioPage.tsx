import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import useApi from "../hooks/useApi"; // <--- Importa o hook

// Esquema de Validação
const schema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  username: z.string().min(3, "O usuário deve ter pelo menos 3 caracteres"),
  password: z.string().min(4, "A senha deve ter pelo menos 4 caracteres"),
  role: z.string().optional(), // Opcional no form, adicionado no submit
});

type CadastroUsuarioFormData = z.infer<typeof schema>;

const CadastroDeUsuarioPage = () => {
  const navigate = useNavigate();
  
  // Instancia o hook apontando para /usuarios
  const { cadastrar } = useApi<CadastroUsuarioFormData>("/usuarios");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CadastroUsuarioFormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (data: CadastroUsuarioFormData) => {
      // Garante que a role seja USER e usa a função do hook
      const dadosParaEnviar = { ...data, role: "USER" };
      return cadastrar(dadosParaEnviar);
    },
    onSuccess: () => {
      alert("Conta criada com sucesso! Faça login para continuar.");
      navigate("/login");
    },
    onError: (error) => {
      alert("Erro ao criar usuário: " + error);
    },
  });

  const onSubmit = (data: CadastroUsuarioFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div className="card shadow p-4" style={{ maxWidth: "500px", width: "100%" }}>
        <h3 className="text-center mb-4">Criar Nova Conta</h3>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label">Nome Completo</label>
            <input
              type="text"
              className={`form-control ${errors.nome ? "is-invalid" : ""}`}
              {...register("nome")}
            />
            {errors.nome && <div className="invalid-feedback">{errors.nome.message}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Nome de Usuário (Login)</label>
            <input
              type="text"
              className={`form-control ${errors.username ? "is-invalid" : ""}`}
              {...register("username")}
            />
            {errors.username && <div className="invalid-feedback">{errors.username.message}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Senha</label>
            <input
              type="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              {...register("password")}
            />
            {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 mb-3"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Criando conta..." : "Cadastrar"}
          </button>
        </form>

        <div className="text-center">
          <Link to="/login" className="text-decoration-none">
            Já tem uma conta? Faça Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CadastroDeUsuarioPage;