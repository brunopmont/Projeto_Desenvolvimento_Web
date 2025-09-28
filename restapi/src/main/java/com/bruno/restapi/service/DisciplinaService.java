package com.bruno.restapi.service;

import com.bruno.restapi.dto.DisciplinaDTO;
import com.bruno.restapi.model.Disciplina;
import com.bruno.restapi.repository.DisciplinaRepository;
import com.bruno.restapi.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DisciplinaService {

    @Autowired
    private DisciplinaRepository disciplinaRepository;

    public List<Disciplina> findAll() {
        return disciplinaRepository.findAll();
    }

    public Disciplina findById(Long id) {
        return disciplinaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Disciplina não encontrada com o id: " + id));
    }

    public Disciplina create(DisciplinaDTO disciplinaDTO) {
        Disciplina disciplina = new Disciplina(disciplinaDTO.getNome(), disciplinaDTO.getCargaHoraria());
        return disciplinaRepository.save(disciplina);
    }

    public Disciplina update(Long id, DisciplinaDTO disciplinaDTO) {
        Disciplina disciplina = findById(id); // Reusa o método de busca, que já lança exceção se não encontrar
        disciplina.setNome(disciplinaDTO.getNome());
        disciplina.setCargaHoraria(disciplinaDTO.getCargaHoraria());
        return disciplinaRepository.save(disciplina);
    }

    public void delete(Long id) {
        Disciplina disciplina = findById(id); // Garante que a disciplina existe antes de deletar
        disciplinaRepository.delete(disciplina);
    }
}