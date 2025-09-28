package com.bruno.restapi.controller;

import com.bruno.restapi.dto.DisciplinaDTO;
import com.bruno.restapi.model.Disciplina;
import com.bruno.restapi.service.DisciplinaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/disciplinas")
public class DisciplinaController {

    @Autowired
    private DisciplinaService disciplinaService;

    @GetMapping
    public ResponseEntity<List<Disciplina>> findAll() {
        List<Disciplina> list = disciplinaService.findAll();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Disciplina> findById(@PathVariable Long id) {
        Disciplina disciplina = disciplinaService.findById(id);
        return ResponseEntity.ok(disciplina);
    }

    @PostMapping
    public ResponseEntity<Disciplina> create(@RequestBody DisciplinaDTO disciplinaDTO) {
        Disciplina novaDisciplina = disciplinaService.create(disciplinaDTO);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(novaDisciplina.getId()).toUri();
        return ResponseEntity.created(uri).body(novaDisciplina);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Disciplina> update(@PathVariable Long id, @RequestBody DisciplinaDTO disciplinaDTO) {
        Disciplina disciplinaAtualizada = disciplinaService.update(id, disciplinaDTO);
        return ResponseEntity.ok(disciplinaAtualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        disciplinaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}