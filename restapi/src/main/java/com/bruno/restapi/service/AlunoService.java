package com.bruno.restapi.service;

import com.bruno.restapi.dto.AlunoDTO;
import com.bruno.restapi.model.Aluno;
import com.bruno.restapi.repository.AlunoRepository;
import com.bruno.restapi.repository.InscricaoRepository; // <--- Importante
import com.bruno.restapi.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AlunoService {

    @Autowired
    private AlunoRepository alunoRepository;

    @Autowired
    private InscricaoRepository inscricaoRepository; // <--- Injeção necessária

    public List<Aluno> findAll() {
        return alunoRepository.findAll();
    }

    public Aluno findById(Long id) {
        return alunoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aluno não encontrado com o id: " + id));
    }

    public Aluno create(AlunoDTO alunoDTO) {
        Aluno aluno = new Aluno(alunoDTO.getNome(), alunoDTO.getEmail(), alunoDTO.getCpf());
        return alunoRepository.save(aluno);
    }

    public Aluno update(Long id, AlunoDTO alunoDTO) {
        Aluno aluno = findById(id);
        aluno.setNome(alunoDTO.getNome());
        aluno.setEmail(alunoDTO.getEmail());
        aluno.setCpf((alunoDTO.getCpf()));
        return alunoRepository.save(aluno);
    }

    public void delete(Long id) {
        Aluno aluno = findById(id);

        // REMOVA ou COMENTE este bloco de validação manual.
        // Deixe o repositório tentar deletar. Se houver inscrições,
        // o DB lançará DataIntegrityViolationException, que seu Handler já trata como 409.
        /*
        if (!inscricaoRepository.findByAluno(aluno).isEmpty()) {
            throw new RuntimeException("Não é possível remover o aluno pois ele possui inscrições ativas.");
        }
        */

        alunoRepository.delete(aluno);
    }

    public List<Aluno> findAlunosNaoInscritos(Long turmaId) {
        return alunoRepository.findAlunosNaoInscritos(turmaId);
    }
}