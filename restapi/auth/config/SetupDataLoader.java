package com.bruno.restapi.auth.config;

import com.bruno.restapi.auth.model.Usuario;
import com.bruno.restapi.auth.repository.UsuarioRepository;
import com.bruno.restapi.auth.util.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

@Configuration
public class SetupDataLoader {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner carregarDadosIniciais() {
        return args -> {
            criarUsuarioSeNaoExistir("Administrador", "admin@mail.com", "password", Role.ADMIN);
            criarUsuarioSeNaoExistir("Usuário Comum", "user@mail.com", "password", Role.USER);
        };
    }

    private void criarUsuarioSeNaoExistir(String nome, String email, String senha, Role role) {
        // Verifica se o usuário já existe pelo email (que usamos como username)
        Optional<Usuario> usuarioExistente = usuarioRepository.findByUsername(email);

        if (usuarioExistente.isEmpty()) {
            Usuario novoUsuario = new Usuario();
            novoUsuario.setNome(nome);
            novoUsuario.setUsername(email); // O email é o login
            novoUsuario.setPassword(passwordEncoder.encode(senha));
            novoUsuario.setRole(role);

            usuarioRepository.save(novoUsuario);
            System.out.println("Usuário criado: " + email + " (" + role + ")");
        }
    }
}