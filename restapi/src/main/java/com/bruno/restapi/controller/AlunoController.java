package com.bruno.restapi.controller;

import com.bruno.restapi.dto.AlunoDTO;
import com.bruno.restapi.model.Aluno;
import com.bruno.restapi.service.AlunoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/alunos")
public class AlunoController {

    @Autowired
    private AlunoService alunoService;

    @GetMapping
    public ResponseEntity<List<Aluno>> findAll() {
        List<Aluno> list = alunoService.findAll();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Aluno> findById(@PathVariable Long id) {
        Aluno aluno = alunoService.findById(id);
        return ResponseEntity.ok(aluno);
    }

    @PostMapping
    public ResponseEntity<Aluno> create(@RequestBody AlunoDTO alunoDTO) {
        Aluno novoAluno = alunoService.create(alunoDTO);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(novoAluno.getId()).toUri();
        return ResponseEntity.created(uri).body(novoAluno);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Aluno> update(@PathVariable Long id, @RequestBody AlunoDTO alunoDTO) {
        Aluno alunoAtualizado = alunoService.update(id, alunoDTO);
        return ResponseEntity.ok(alunoAtualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        alunoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}