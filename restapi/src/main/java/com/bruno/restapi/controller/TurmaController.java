package com.bruno.restapi.controller;

import com.bruno.restapi.dto.TurmaDTO;
import com.bruno.restapi.model.Turma;
import com.bruno.restapi.service.TurmaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/turmas")
public class TurmaController {

    @Autowired
    private TurmaService turmaService;

    @GetMapping
    public ResponseEntity<List<Turma>> findAll() {
        List<Turma> list = turmaService.findAll();
        return ResponseEntity.ok(list);
    }

    @PostMapping
    public ResponseEntity<Turma> create(@RequestBody TurmaDTO turmaDTO) {
        Turma novaTurma = turmaService.create(turmaDTO);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(novaTurma.getId()).toUri();
        return ResponseEntity.created(uri).body(novaTurma);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Turma> findById(@PathVariable Long id) {
        Turma turma = turmaService.findById(id);
        return ResponseEntity.ok(turma);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        turmaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}