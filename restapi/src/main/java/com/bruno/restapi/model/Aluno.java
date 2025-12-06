package com.bruno.restapi.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.validator.constraints.br.CPF;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "aluno")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Aluno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @NotBlank(message = "O email deve ser informado.")
    @Email(message = "Email inválido.")
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank(message = "O CPF deve ser informado.")
    @CPF(message = "CPF inválido")
    @Column(unique = true)
    private String cpf;

    // Construtor sem o ID
    public Aluno(String nome, String email, String cpf) {
        this.nome = nome;
        this.email = email;
        this.cpf = cpf;
    }
}