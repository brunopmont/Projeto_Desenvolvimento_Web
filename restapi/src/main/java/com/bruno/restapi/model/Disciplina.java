package com.bruno.restapi.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "disciplina")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Disciplina {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nome;

    @Column(name = "carga_horaria", nullable = false)
    private int cargaHoraria;

    // Construtor sem o ID, útil para a criação de novas instâncias
    public Disciplina(String nome, int cargaHoraria) {
        this.nome = nome;
        this.cargaHoraria = cargaHoraria;
    }
}