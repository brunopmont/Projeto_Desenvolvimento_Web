package com.bruno.restapi.controller;

import com.bruno.restapi.dto.TurmaDTO;
import com.bruno.restapi.model.Turma;
import com.bruno.restapi.service.TurmaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List; // <--- Importante para o List<>

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/turmas")
public class TurmaController {

    @Autowired
    private TurmaService turmaService; // O Service deve ser injetado aqui

    @GetMapping
    public ResponseEntity<List<Turma>> findAll() {
        List<Turma> list = turmaService.findAll();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Turma> findById(@PathVariable Long id) {
        Turma turma = turmaService.findById(id);
        return ResponseEntity.ok(turma);
    }

    // --- NOVO MÉTODO ---
    @GetMapping("/disciplina/{disciplinaId}")
    public ResponseEntity<List<Turma>> findByDisciplina(@PathVariable Long disciplinaId) {
        return ResponseEntity.ok(turmaService.findByDisciplina(disciplinaId));
    }
    // -------------------

    @PostMapping
    public ResponseEntity<Turma> create(@RequestBody TurmaDTO turmaDTO) {
        Turma novaTurma = turmaService.create(turmaDTO);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(novaTurma.getId()).toUri();
        return ResponseEntity.created(uri).body(novaTurma);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        turmaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}