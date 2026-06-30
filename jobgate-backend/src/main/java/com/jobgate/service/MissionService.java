package com.jobgate.service;

import com.jobgate.entity.Mission;
import com.jobgate.entity.ResponsableRH;
import com.jobgate.entity.Stagiaire;
import com.jobgate.repository.MissionRepository;
import com.jobgate.repository.ResponsableRHRepository;
import com.jobgate.repository.StagiaireRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MissionService {

    private final MissionRepository missionRepository;
    private final StagiaireRepository stagiaireRepository;
    private final ResponsableRHRepository responsableRHRepository;

    public List<Mission> getAllMissions() {
        return missionRepository.findAll();
    }

    public Mission getMissionById(Long id) {
        return missionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mission non trouvée avec id : " + id));
    }

    public Mission createMission(Mission mission) {
        return missionRepository.save(mission);
    }

    public Mission updateMission(Long id, Mission updatedMission) {
        Mission mission = getMissionById(id);
        mission.setTitre(updatedMission.getTitre());
        mission.setDescription(updatedMission.getDescription());
        mission.setDateDebut(updatedMission.getDateDebut());
        mission.setDateFin(updatedMission.getDateFin());
        mission.setStatut(updatedMission.getStatut());
        return missionRepository.save(mission);
    }

    public void deleteMission(Long id) {
        missionRepository.deleteById(id);
    }

    public List<Mission> getMissionsByStagiaire(Long stagiaireId) {
        Stagiaire stagiaire = stagiaireRepository.findById(stagiaireId)
                .orElseThrow(() -> new RuntimeException("Stagiaire non trouvé"));
        return missionRepository.findByStagiaire(stagiaire);
    }
}