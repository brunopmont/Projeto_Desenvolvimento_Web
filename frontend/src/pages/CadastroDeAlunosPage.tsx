import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import useApi from "../hooks/useApi"; // Importa useApi

// O esquema Zod permanece igual
const alunoSchema = z.object({
  nome: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Formato de email inválido"),
  cpf: z.string().length(11, "O CPF deve ter 11 dígitos"),
});

type AlunoFormData = z.infer<typeof alunoSchema>;

const CadastroDeAlunosPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // 1. Usa o hook apontando para /alunos
  // Nota: AlunoFormData é compatível com o tipo Aluno esperado, ou você pode usar 'any' se preferir simplificar aqui
  const { cadastrar } = useApi<AlunoFormData>("/alunos"); 

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AlunoFormData>({
    resolver: zodResolver(alunoSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: AlunoFormData) => cadastrar(data), // 2. Usa a função cadastrar
    onSuccess: () => {
      alert("Aluno cadastrado!");
      // Invalida o cache para que a lista de alunos seja atualizada
      queryClient.invalidateQueries({ queryKey: ["alunos"] });
      navigate(`/alunos`); 
    },
    onError: (error) => {
      console.error(error);
      alert("Erro ao cadastrar aluno.");
    },
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

        <button type="submit" className="btn btn-primary" disabled={mutation.isPending}>
          {mutation.isPending ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </div>
  );
};

export default CadastroDeAlunosPage;