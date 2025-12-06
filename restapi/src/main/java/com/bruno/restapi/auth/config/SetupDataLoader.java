package com.bruno.restapi.auth.config;

import com.bruno.restapi.auth.model.Usuario;
import com.bruno.restapi.auth.repository.UsuarioRepository;
import com.bruno.restapi.auth.util.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Component
public class SetupDataLoader implements ApplicationListener<ContextRefreshedEvent> {

    private boolean alreadySetup = false;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void onApplicationEvent(ContextRefreshedEvent event) {
        if (alreadySetup) {
            return;
        }

        // Cria ADMIN com email como username
        criarUsuarioSeNaoExistir("Administrador", "admin@mail.com", "password", Role.ADMIN);

        // Cria USER com email como username
        criarUsuarioSeNaoExistir("Usuário Comum", "user@mail.com", "password", Role.USER);

        alreadySetup = true;
    }

    @Transactional
    void criarUsuarioSeNaoExistir(String nome, String email, String password, Role role) {
        // Verifica se o usuário já existe usando o EMAIL como chave de busca para o username
        // Isso garante que não duplicaremos se o servidor reiniciar
        Optional<Usuario> usuarioExistente = usuarioRepository.findByUsername(email);

        if (usuarioExistente.isEmpty()) {
            Usuario user = new Usuario();
            user.setNome(nome);
            // TRUQUE DO LOGIN: Salvamos o email no campo username
            user.setUsername(email);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setRole(role);

            usuarioRepository.save(user);
            System.out.println("Usuário criado com sucesso: " + email + " / " + role);
        }
    }
}