import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8080";

// Esquema de validação com Zod
const alunoSchema = z.object({
  nome: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Formato de email inválido"),
  cpf: z.string().length(11, "O CPF deve ter 11 dígitos"),
});

// Tipo inferido do Zod
type AlunoFormData = z.infer<typeof alunoSchema>;

const CadastroDeAlunosPage = () => {
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AlunoFormData>({
    resolver: zodResolver(alunoSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: AlunoFormData) => {
      const res = await fetch(`${API_URL}/alunos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erro ao cadastrar");
      return res.json();
    },
    onSuccess: (data) => {
      alert("Aluno cadastrado!");
      navigate(`/alunos`); 
    },
    onError: () => alert("Erro ao cadastrar aluno."),
  });

  const onSubmit = (data: AlunoFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="container mt-4">
      <h2>Cadastro de Aluno</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="w-50">
        <div className="mb-3">
          <label className="form-label">Nome</label>
          <input {...register("nome")} className="form-control" />
          {errors.nome && <span className="text-danger">{errors.nome.message}</span>}
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input {...register("email")} className="form-control" />
          {errors.email && <span className="text-danger">{errors.email.message}</span>}
        </div>

        <div className="mb-3">
          <label className="form-label">CPF</label>
          <input {...register("cpf")} className="form-control" />
          {errors.cpf && <span className="text-danger">{errors.cpf.message}</span>}
        </div>

        <button type="submit" className="btn btn-primary">
          {mutation.isPending ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </div>
  );
};

export default CadastroDeAlunosPage;