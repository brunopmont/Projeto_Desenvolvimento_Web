package com.bruno.restapi.controller;

import com.bruno.restapi.dto.InscricaoDTO;
import com.bruno.restapi.model.Inscricao;
import com.bruno.restapi.service.InscricaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/inscricoes")
public class InscricaoController {

    @Autowired
    private InscricaoService inscricaoService;

    @GetMapping
    public ResponseEntity<List<Inscricao>> findAll() {
        List<Inscricao> list = inscricaoService.findAll();
        return ResponseEntity.ok(list);
    }

    @PostMapping
    public ResponseEntity<Inscricao> create(@RequestBody InscricaoDTO inscricaoDTO) {
        Inscricao novaInscricao = inscricaoService.create(inscricaoDTO);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(novaInscricao.getId()).toUri();
        return ResponseEntity.created(uri).body(novaInscricao);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        inscricaoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}