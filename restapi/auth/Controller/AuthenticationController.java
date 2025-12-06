package com.bruno.restapi.auth.controller; // Ajuste o pacote se necessário

import com.bruno.restapi.auth.service.JwtService;
import com.bruno.restapi.auth.util.TokenResponse;
import com.bruno.restapi.auth.util.UsuarioLogin;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/autenticacao")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> autenticar(@RequestBody UsuarioLogin usuarioLogin) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        usuarioLogin.getUsername(),
                        usuarioLogin.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        TokenResponse tokenResponse = jwtService.gerarToken(authentication);

        return ResponseEntity.ok(tokenResponse);
    }
}