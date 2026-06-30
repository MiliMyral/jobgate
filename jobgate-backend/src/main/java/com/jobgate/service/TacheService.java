package com.jobgate.service;

import com.jobgate.entity.Mission;
import com.jobgate.entity.Tache;
import com.jobgate.repository.MissionRepository;
import com.jobgate.repository.TacheRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TacheService {

    private final TacheRepository tacheRepository;
    private final MissionRepository missionRepository;

    public List<Tache> getAllTaches() {
        return tacheRepository.findAll();
    }

    public Tache getTacheById(Long id) {
        return tacheRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tâche non trouvée avec id : " + id));
    }

    public Tache createTache(Tache tache) {
        return tacheRepository.save(tache);
    }

    public Tache updateTache(Long id, Tache updatedTache) {
        Tache tache = getTacheById(id);
        tache.setTitre(updatedTache.getTitre());
        tache.setDescription(updatedTache.getDescription());
        tache.setStatut(updatedTache.getStatut());
        return tacheRepository.save(tache);
    }

    public void deleteTache(Long id) {
        tacheRepository.deleteById(id);
    }

    public List<Tache> getTachesByMission(Long missionId) {
        Mission mission = missionRepository.findById(missionId)
                .orElseThrow(() -> new RuntimeException("Mission non trouvée"));
        return tacheRepository.findByMission(mission);
    }
}