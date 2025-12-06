package com.bruno.restapi.auth.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsuarioLogin {
    private String username; // No seu caso, o usuário digita o email aqui
    private String password;
}