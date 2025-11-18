package com.bruno.restapi.repository;

import com.bruno.restapi.model.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AlunoRepository extends JpaRepository<Aluno, Long> {
    @Query("SELECT a FROM Aluno a WHERE a.id NOT IN (SELECT i.aluno.id FROM Inscricao i WHERE i.turma.id = :turmaId)")
    List<Aluno> findAlunosNaoInscritos(Long turmaId);
}