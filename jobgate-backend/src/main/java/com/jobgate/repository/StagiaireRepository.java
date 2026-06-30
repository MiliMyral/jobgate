package com.jobgate.repository;

import com.jobgate.entity.Stagiaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StagiaireRepository extends JpaRepository<Stagiaire, Long> {
    List<Stagiaire> findByStatut(Stagiaire.StatutStage statut);
    List<Stagiaire> findByUniversite(String universite);
    Boolean existsByEmail(String email);
}