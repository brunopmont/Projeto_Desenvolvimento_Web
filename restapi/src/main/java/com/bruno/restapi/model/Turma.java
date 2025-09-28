package com.bruno.restapi.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "turma")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Turma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private int ano;

    @Column(nullable = false)
    private int periodo;

    @ManyToOne
    @JoinColumn(name = "professor_id", nullable = false)
    private Professor professor;

    @ManyToOne
    @JoinColumn(name = "disciplina_id", nullable = false)
    private Disciplina disciplina;

    @OneToMany(
            mappedBy = "turma",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.EAGER
    )
    @JsonManagedReference
    private List<Inscricao> inscricoes = new ArrayList<>();

    // Construtor sem o ID
    public Turma(int ano, int periodo, Professor professor, Disciplina disciplina) {
        this.ano = ano;
        this.periodo = periodo;
        this.professor = professor;
        this.disciplina = disciplina;
    }
}