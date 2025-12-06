package com.bruno.restapi.auth.repository;

import com.bruno.restapi.auth.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Método utilizado pelo SetupDataLoader e pelo JwtAuthenticationFilter
    // para encontrar o utilizador pelo login (que no seu caso é o email)
    Optional<Usuario> findByUsername(String username);

    // Opcional: método para encontrar por email explicitamente, se necessário no futuro
    Optional<Usuario> findByEmail(String email);
}