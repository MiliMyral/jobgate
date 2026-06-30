package com.jobgate.repository;

import com.jobgate.entity.Mission;
import com.jobgate.entity.Tache;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TacheRepository extends JpaRepository<Tache, Long> {
    List<Tache> findByMission(Mission mission);
    List<Tache> findByStatut(Tache.StatutTache statut);
}