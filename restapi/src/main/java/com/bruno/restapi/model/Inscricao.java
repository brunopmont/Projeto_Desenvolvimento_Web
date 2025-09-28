package com.bruno.restapi.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "inscricao")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Inscricao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "data_hora", nullable = false)
    private LocalDateTime dataHora;

    @ManyToOne
    @JoinColumn(name = "aluno_id", nullable = false)
    private Aluno aluno;

    @ManyToOne
    @JoinColumn(name = "turma_id", nullable = false)
    @JsonBackReference
    private Turma turma;

    // Construtor sem o ID, ideal para criação
    public Inscricao(Aluno aluno, Turma turma) {
        this.aluno = aluno;
        this.turma = turma;
        this.dataHora = LocalDateTime.now(); // A data e hora são definidas no momento da criação
    }
}