package com.bruno.restapi.service;

import com.bruno.restapi.dto.TurmaDTO;
import com.bruno.restapi.model.Disciplina;
import com.bruno.restapi.model.Professor;
import com.bruno.restapi.model.Turma;
import com.bruno.restapi.repository.DisciplinaRepository;
import com.bruno.restapi.repository.ProfessorRepository;
import com.bruno.restapi.repository.TurmaRepository;
import com.bruno.restapi.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TurmaService {

    @Autowired
    private TurmaRepository turmaRepository;

    @Autowired
    private ProfessorRepository professorRepository;

    @Autowired
    private DisciplinaRepository disciplinaRepository;

    public List<Turma> findAll() {
        return turmaRepository.findAll();
    }

    public Turma create(TurmaDTO turmaDTO) {
        // 1. Busca o Professor pelo ID fornecido no DTO
        Professor professor = professorRepository.findById(turmaDTO.getProfessorId())
                .orElseThrow(() -> new ResourceNotFoundException("Professor não encontrado com o id: " + turmaDTO.getProfessorId()));

        // 2. Busca a Disciplina pelo ID fornecido no DTO
        Disciplina disciplina = disciplinaRepository.findById(turmaDTO.getDisciplinaId())
                .orElseThrow(() -> new ResourceNotFoundException("Disciplina não encontrada com o id: " + turmaDTO.getDisciplinaId()));

        // 3. Cria a nova entidade Turma com os objetos encontrados
        Turma turma = new Turma(turmaDTO.getAno(), turmaDTO.getPeriodo(), professor, disciplina);

        // 4. Salva a nova turma no banco
        return turmaRepository.save(turma);
    }

    public Turma findById(Long id) {
        return turmaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Turma não encontrada com o id: " + id));
    }

    public void delete(Long id) {
        // Verifica se a turma existe antes de deletar
        Turma turma = turmaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Turma não encontrada com o id: " + id));
        turmaRepository.delete(turma);
    }
}