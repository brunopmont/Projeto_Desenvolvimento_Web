import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";

// URL do seu backend
const API_URL = "http://localhost:8080";

// 1. Esquema de Validação com Zod
const schema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  username: z.string().min(3, "O usuário deve ter pelo menos 3 caracteres"),
  password: z.string().min(4, "A senha deve ter pelo menos 4 caracteres"),
});

type CadastroUsuarioFormData = z.infer<typeof schema>;

const CadastroDeUsuarioPage = () => {
  const navigate = useNavigate();

  // 2. Configuração do Formulário
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CadastroUsuarioFormData>({
    resolver: zodResolver(schema),
  });

  // 3. Mutação para enviar os dados ao Backend
  const mutation = useMutation({
    mutationFn: async (data: CadastroUsuarioFormData) => {
      // O backend espera um objeto com { nome, username, password, role: 'USER' }
      // Mas o controller /usuarios geralmente define 'USER' por padrão se não enviado,
      // ou podemos enviar explicitamente aqui se seu DTO exigir.
      // Vou enviar apenas os dados do form, assumindo que seu backend trata a Role.
      const response = await fetch(`${API_URL}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, role: "USER" }), // Garante que é USER
      });

      if (!response.ok) {
        throw new Error("Erro ao criar usuário. Tente outro login.");
      }
      return response.json();
    },
    onSuccess: () => {
      alert("Conta criada com sucesso! Faça login para continuar.");
      navigate("/login"); // Redireciona para a tela de login
    },
    onError: (error) => {
      alert(error.message);
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
          {/* Campo Nome */}
          <div className="mb-3">
            <label className="form-label">Nome Completo</label>
            <input
              type="text"
              className={`form-control ${errors.nome ? "is-invalid" : ""}`}
              {...register("nome")}
            />
            {errors.nome && <div className="invalid-feedback">{errors.nome.message}</div>}
          </div>

          {/* Campo Usuário (Login) */}
          <div className="mb-3">
            <label className="form-label">Nome de Usuário (Login)</label>
            <input
              type="text"
              className={`form-control ${errors.username ? "is-invalid" : ""}`}
              {...register("username")}
            />
            {errors.username && <div className="invalid-feedback">{errors.username.message}</div>}
          </div>

          {/* Campo Senha */}
          <div className="mb-3">
            <label className="form-label">Senha</label>
            <input
              type="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              {...register("password")}
            />
            {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
          </div>

          {/* Botão de Enviar */}
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