package com.bruno.restapi.service;

import com.bruno.restapi.dto.ProfessorDTO;
import com.bruno.restapi.model.Professor;
import com.bruno.restapi.repository.ProfessorRepository;
import com.bruno.restapi.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProfessorService {

    @Autowired
    private ProfessorRepository professorRepository;

    public List<Professor> findAll() {
        return professorRepository.findAll();
    }

    public Professor findById(Long id) {
        return professorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Professor não encontrado com o id: " + id));
    }

    public Professor create(ProfessorDTO professorDTO) {
        Professor professor = new Professor(professorDTO.getNome(), professorDTO.getEmail());
        return professorRepository.save(professor);
    }

    public Professor update(Long id, ProfessorDTO professorDTO) {
        Professor professor = findById(id);
        professor.setNome(professorDTO.getNome());
        professor.setEmail(professorDTO.getEmail());
        return professorRepository.save(professor);
    }

    public void delete(Long id) {
        Professor professor = findById(id);
        professorRepository.delete(professor);
    }
}