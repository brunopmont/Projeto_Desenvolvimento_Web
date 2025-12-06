package com.bruno.restapi.auth.config;

import com.bruno.restapi.auth.filter.JwtAuthenticationFilter;
import com.bruno.restapi.auth.service.UsuarioDetailsService;
import com.bruno.restapi.auth.util.Role;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@AllArgsConstructor
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UsuarioDetailsService usuarioDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Permite requisições vindas do seu frontend (React)
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .sessionManagement(c -> c.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .csrf(c -> c.disable())
                .cors(c -> c.configurationSource(corsConfigurationSource()))

                .authorizeHttpRequests(authorize -> authorize
                        // --- ROTAS PÚBLICAS ---
                        // Login e Cadastro de Usuários são públicos
                        .requestMatchers(HttpMethod.POST, "/autenticacao/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/usuarios").permitAll()

                        // --- ROTAS DE ALUNOS (TRABALHO 07) ---
                        // Ver alunos: Qualquer usuário logado (USER ou ADMIN)
                        .requestMatchers(HttpMethod.GET, "/alunos/**").hasAnyRole(Role.USER.name(), Role.ADMIN.name())
                        // .requestMatchers(HttpMethod.GET, "/alunos/**").authenticated() // Alternativa se quiser apenas checar login

                        // Cadastrar, Alterar e Remover alunos: APENAS ADMIN
                        .requestMatchers(HttpMethod.POST, "/alunos/**").hasRole(Role.ADMIN.name())
                        .requestMatchers(HttpMethod.PUT, "/alunos/**").hasRole(Role.ADMIN.name())
                        .requestMatchers(HttpMethod.DELETE, "/alunos/**").hasRole(Role.ADMIN.name())

                        // --- OUTRAS ROTAS ---
                        // Exemplo: rotas de Turma, Disciplina, etc (se precisar restringir)
                        // .requestMatchers(HttpMethod.POST, "/turmas/**").hasRole(Role.ADMIN.name())

                        // Qualquer outra rota não especificada acima exige autenticação
                        .anyRequest().authenticated())

                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(c -> {
                    c.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED));
                    c.accessDeniedHandler((request, response, accessDeniedException) -> {
                        response.setStatus(HttpStatus.FORBIDDEN.value());
                    });
                });

        return httpSecurity.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        var provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(passwordEncoder());
        provider.setUserDetailsService(usuarioDetailsService);
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}