package com.bruno.restapi.repository;

import com.bruno.restapi.model.Turma;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TurmaRepository extends JpaRepository<Turma, Long> {
    List<Turma> findByDisciplinaId(Long disciplinaId);
}