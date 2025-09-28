package com.bruno.restapi.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TurmaDTO {
    private int ano;
    private int periodo;
    private Long professorId;
    private Long disciplinaId;
}