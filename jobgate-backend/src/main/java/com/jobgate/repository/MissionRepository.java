package com.jobgate.repository;

import com.jobgate.entity.Mission;
import com.jobgate.entity.Stagiaire;
import com.jobgate.entity.ResponsableRH;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MissionRepository extends JpaRepository<Mission, Long> {
    List<Mission> findByStagiaire(Stagiaire stagiaire);
    List<Mission> findByResponsable(ResponsableRH responsable);
    List<Mission> findByStatut(Mission.StatutMission statut);
}