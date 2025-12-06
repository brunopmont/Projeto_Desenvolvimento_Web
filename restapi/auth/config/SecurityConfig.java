package com.bruno.restapi.auth.config;

import com.bruno.restapi.auth.filter.JwtAuthenticationFilter;
import com.bruno.restapi.auth.util.Role;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@AllArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final AuthenticationProvider authenticationProvider;

    // 1. CONFIGURAÇÃO DE CORS (Crucial para o React funcionar)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Permite a origem do seu Frontend (Vite/React)
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        // Permite os métodos HTTP necessários
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // Permite os cabeçalhos (incluindo Authorization para o Token)
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                // 2. Aplica a configuração de CORS definida acima
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                .authorizeHttpRequests(auth -> auth
                        // Rotas Públicas
                        .requestMatchers(HttpMethod.POST, "/autenticacao/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/usuarios").permitAll()

                        // Rotas Protegidas (Exemplo Alunos)
                        .requestMatchers(HttpMethod.GET, "/alunos/**").hasAnyRole(Role.USER.name(), Role.ADMIN.name())
                        .requestMatchers(HttpMethod.POST, "/alunos/**").hasRole(Role.ADMIN.name())
                        .requestMatchers(HttpMethod.PUT, "/alunos/**").hasRole(Role.ADMIN.name())
                        .requestMatchers(HttpMethod.DELETE, "/alunos/**").hasRole(Role.ADMIN.name())

                        .anyRequest().authenticated()
                )
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(ex -> {
                    ex.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED));
                    ex.accessDeniedHandler((req, res, e) -> res.setStatus(HttpStatus.FORBIDDEN.value()));
                });

        return http.build();
    }
}