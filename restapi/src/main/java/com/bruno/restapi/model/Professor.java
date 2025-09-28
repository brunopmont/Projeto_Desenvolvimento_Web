package com.bruno.restapi.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "professor")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Professor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    // Construtor sem o ID
    public Professor(String nome, String email) {
        this.nome = nome;
        this.email = email;
    }
}