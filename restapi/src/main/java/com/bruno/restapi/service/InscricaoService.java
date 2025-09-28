package com.bruno.restapi.service;

import com.bruno.restapi.dto.InscricaoDTO;
import com.bruno.restapi.model.Aluno;
import com.bruno.restapi.model.Inscricao;
import com.bruno.restapi.model.Turma;
import com.bruno.restapi.repository.AlunoRepository;
import com.bruno.restapi.repository.InscricaoRepository;
import com.bruno.restapi.repository.TurmaRepository;
import com.bruno.restapi.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InscricaoService {

    @Autowired
    private InscricaoRepository inscricaoRepository;

    @Autowired
    private AlunoRepository alunoRepository;

    @Autowired
    private TurmaRepository turmaRepository;

    public List<Inscricao> findAll() {
        return inscricaoRepository.findAll();
    }

    public Inscricao create(InscricaoDTO inscricaoDTO) {
        // 1. Valida e busca o Aluno
        Aluno aluno = alunoRepository.findById(inscricaoDTO.getAlunoId())
                .orElseThrow(() -> new ResourceNotFoundException("Aluno não encontrado com o id: " + inscricaoDTO.getAlunoId()));

        // 2. Valida e busca a Turma
        Turma turma = turmaRepository.findById(inscricaoDTO.getTurmaId())
                .orElseThrow(() -> new ResourceNotFoundException("Turma não encontrada com o id: " + inscricaoDTO.getTurmaId()));

        // 3. Cria a nova Inscrição
        Inscricao inscricao = new Inscricao(aluno, turma);

        // 4. Salva no banco
        return inscricaoRepository.save(inscricao);
    }

    public void delete(Long id) {
        Inscricao inscricao = inscricaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inscrição não encontrada com o id: " + id));
        inscricaoRepository.delete(inscricao);
    }
}