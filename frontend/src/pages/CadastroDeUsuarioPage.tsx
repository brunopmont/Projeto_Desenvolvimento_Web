import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import useApi from "../hooks/useApi";
import useTokenStore from "../store/TokenStore"; // Importar a Store para verificar se é Admin

// Esquema de Validação
const schema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  username: z.string().min(3, "O usuário deve ter pelo menos 3 caracteres"),
  password: z.string().min(4, "A senha deve ter pelo menos 4 caracteres"),
  role: z.string().optional(), // O campo role é opcional no formulário visual
});

type CadastroUsuarioFormData = z.infer<typeof schema>;

const CadastroDeUsuarioPage = () => {
  const navigate = useNavigate();
  
  // 1. Verifica se o usuário atual é ADMIN
  const tokenResponse = useTokenStore((state) => state.tokenResponse);
  const isAdmin = tokenResponse.role === "ADMIN";

  const { cadastrar } = useApi<CadastroUsuarioFormData>("/usuarios");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CadastroUsuarioFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: "USER" // Valor padrão
    }
  });

  const mutation = useMutation({
    mutationFn: (data: CadastroUsuarioFormData) => {
      // 2. Lógica dinâmica: Se o admin escolheu uma role, usa ela.
      // Se não (cadastro público), força "USER".
      const roleParaEnviar = data.role ? data.role : "USER";
      
      const dadosParaEnviar = { ...data, role: roleParaEnviar };
      return cadastrar(dadosParaEnviar);
    },
    onSuccess: () => {
      alert("Conta criada com sucesso!");
      // Se for admin criando outro usuário, talvez não queira sair da página, 
      // mas para simplificar vamos manter o redirect ou voltar para home.
      if (isAdmin) {
          navigate("/"); 
      } else {
          navigate("/login");
      }
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
        <h3 className="text-center mb-4">
            {isAdmin ? "Cadastrar Novo Usuário" : "Criar Nova Conta"}
        </h3>
        
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

          {/* 3. Campo de Seleção de Perfil (Só aparece para ADMIN) */}
          {isAdmin && (
            <div className="mb-3">
                <label className="form-label fw-bold text-primary">Perfil de Acesso</label>
                <select 
                    className="form-select" 
                    {...register("role")}
                >
                    <option value="USER">Usuário Padrão (USER)</option>
                    <option value="ADMIN">Administrador (ADMIN)</option>
                </select>
                <div className="form-text">
                    Como administrador, você pode criar outros administradores.
                </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-success w-100 mb-3"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Salvando..." : "Cadastrar"}
          </button>
        </form>

        {!isAdmin && (
            <div className="text-center">
            <Link to="/login" className="text-decoration-none">
                Já tem uma conta? Faça Login
            </Link>
            </div>
        )}
        
        {isAdmin && (
             <div className="text-center">
             <Link to="/" className="text-decoration-none">
                 Voltar para Home
             </Link>
             </div>
        )}
      </div>
    </div>
  );
};

export default CadastroDeUsuarioPage;