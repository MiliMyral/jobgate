package com.jobgate.repository;

import com.jobgate.entity.Evaluation;
import com.jobgate.entity.Stagiaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    List<Evaluation> findByStagiaire(Stagiaire stagiaire);
}