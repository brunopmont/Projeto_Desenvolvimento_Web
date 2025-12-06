package com.bruno.restapi.controller;

import com.bruno.restapi.auth.dto.TokenResponse;
import com.bruno.restapi.auth.dto.UsuarioLogin;
import com.bruno.restapi.auth.model.Usuario;
import com.bruno.restapi.auth.service.JwtService;
import lombok.RequiredArgsConstructor; // Opcional, se usar @Autowired não precisa
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/autenticacao")
public class AuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@RequestBody UsuarioLogin usuarioLogin) {
        // 1. Autentica o usuário (verifica email e senha)
        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(usuarioLogin.getUsername(), usuarioLogin.getPassword());

        Authentication authentication = authenticationManager.authenticate(authToken);

        // 2. Recupera o usuário autenticado (Cast para a nossa entidade Usuario)
        Usuario usuario = (Usuario) authentication.getPrincipal();

        // 3. Gera o Token (Método correto: generateToken)
        String token = jwtService.generateToken(usuario);

        // 4. Retorna o DTO com token e dados do usuário
        return ResponseEntity.ok(new TokenResponse(token, usuario.getNome(), usuario.getRole().name()));
    }
}