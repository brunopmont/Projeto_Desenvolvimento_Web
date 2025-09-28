package com.bruno.restapi.controller;

import com.bruno.restapi.dto.ProfessorDTO;
import com.bruno.restapi.model.Professor;
import com.bruno.restapi.service.ProfessorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/professores")
public class ProfessorController {

    @Autowired
    private ProfessorService professorService;

    @GetMapping
    public ResponseEntity<List<Professor>> findAll() {
        List<Professor> list = professorService.findAll();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Professor> findById(@PathVariable Long id) {
        Professor professor = professorService.findById(id);
        return ResponseEntity.ok(professor);
    }

    @PostMapping
    public ResponseEntity<Professor> create(@RequestBody ProfessorDTO professorDTO) {
        Professor novoProfessor = professorService.create(professorDTO);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(novoProfessor.getId()).toUri();
        return ResponseEntity.created(uri).body(novoProfessor);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Professor> update(@PathVariable Long id, @RequestBody ProfessorDTO professorDTO) {
        Professor professorAtualizado = professorService.update(id, professorDTO);
        return ResponseEntity.ok(professorAtualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        professorService.delete(id);
        return ResponseEntity.noContent().build();
    }
}