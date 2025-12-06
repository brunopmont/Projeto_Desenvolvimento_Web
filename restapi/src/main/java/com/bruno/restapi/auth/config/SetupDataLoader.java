package com.bruno.restapi.auth.config;

import com.bruno.restapi.auth.model.Usuario;
import com.bruno.restapi.auth.repository.UsuarioRepository;
import com.bruno.restapi.auth.util.Role;
import com.bruno.restapi.model.*;
import com.bruno.restapi.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Configuration
public class SetupDataLoader {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Repositórios Acadêmicos
    @Autowired
    private AlunoRepository alunoRepository;
    @Autowired
    private ProfessorRepository professorRepository;
    @Autowired
    private DisciplinaRepository disciplinaRepository;
    @Autowired
    private TurmaRepository turmaRepository;
    @Autowired
    private InscricaoRepository inscricaoRepository;

    @Bean
    public CommandLineRunner carregarDadosIniciais() {
        return args -> {
            // 1. Cria Usuários de Sistema (Admin e User)
            criarUsuarioSeNaoExistir("Administrador", "admin@mail.com", "password", Role.ADMIN);
            criarUsuarioSeNaoExistir("Usuário Comum", "user@mail.com", "password", Role.USER);

            // 2. Popula Dados Acadêmicos (Apenas se não existirem alunos)
            if (alunoRepository.count() == 0) {
                popularDadosAcademicos();
            }
        };
    }

    private void criarUsuarioSeNaoExistir(String nome, String email, String senha, Role role) {
        Optional<Usuario> usuarioExistente = usuarioRepository.findByUsername(email);

        if (usuarioExistente.isEmpty()) {
            Usuario novoUsuario = new Usuario();
            novoUsuario.setNome(nome);
            novoUsuario.setUsername(email);
            novoUsuario.setPassword(passwordEncoder.encode(senha));
            novoUsuario.setRole(role);

            usuarioRepository.save(novoUsuario);
            System.out.println("Usuário criado: " + email + " (" + role + ")");
        }
    }

    @Transactional
    void popularDadosAcademicos() {
        // --- 1. Criar Professores ---
        Professor prof1 = new Professor("Alan Turing", "alan@turing.com");
        Professor prof2 = new Professor("Ada Lovelace", "ada@lovelace.com");
        professorRepository.save(prof1);
        professorRepository.save(prof2);

        // --- 2. Criar Disciplinas ---
        Disciplina disc1 = new Disciplina("Lógica de Programação", 60);
        Disciplina disc2 = new Disciplina("Estrutura de Dados", 80);
        Disciplina disc3 = new Disciplina("Desenvolvimento Web", 120);
        disciplinaRepository.save(disc1);
        disciplinaRepository.save(disc2);
        disciplinaRepository.save(disc3);

        // --- 3. Criar Turmas (COM CÓDIGOS NOVOS) ---
        // A001 - Lógica (Prof. Alan)
        Turma turma1 = new Turma(2025, 1, prof1, disc1, "A001");

        // A002 - Estrutura (Prof. Ada)
        Turma turma2 = new Turma(2025, 1, prof2, disc2, "A002");

        // B001 - Web (Prof. Alan pega mais uma)
        Turma turma3 = new Turma(2025, 1, prof1, disc3, "B001");

        turmaRepository.save(turma1);
        turmaRepository.save(turma2);
        turmaRepository.save(turma3);

        // --- 4. Criar Alunos ---

        // Alunos que SERÃO inscritos (Teste de bloqueio de exclusão)
        Aluno alunoInscrito1 = new Aluno("Bruno Monteiro", "bruno@email.com", "111.111.111-11");
        Aluno alunoInscrito2 = new Aluno("Raphael Fernandes", "raphael@email.com", "222.222.222-22");

        // Alunos LIVRES (Teste de exclusão com sucesso)
        Aluno alunoLivre1 = new Aluno("João Livre", "joao.livre@email.com", "333.333.333-33");
        Aluno alunoLivre2 = new Aluno("Maria Livre", "maria.livre@email.com", "444.444.444-44");
        Aluno alunoLivre3 = new Aluno("Carlos Solto", "carlos.solto@email.com", "555.555.555-55");

        alunoRepository.save(alunoInscrito1);
        alunoRepository.save(alunoInscrito2);
        alunoRepository.save(alunoLivre1);
        alunoRepository.save(alunoLivre2);
        alunoRepository.save(alunoLivre3);

        // --- 5. Criar Inscrições (Vínculos) ---
        // Bruno faz Lógica (A001) e Web (B001)
        inscricaoRepository.save(new Inscricao(alunoInscrito1, turma1));
        inscricaoRepository.save(new Inscricao(alunoInscrito1, turma3));

        // Raphael faz apenas Estrutura (A002)
        inscricaoRepository.save(new Inscricao(alunoInscrito2, turma2));

        System.out.println("Dados acadêmicos populados com sucesso!");
        System.out.println("Turmas criadas: A001, A002, B001.");
    }
}