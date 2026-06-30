package com.jobgate.service;

import com.jobgate.entity.Role;
import com.jobgate.entity.Stagiaire;
import com.jobgate.repository.RoleRepository;
import com.jobgate.repository.StagiaireRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class StagiaireService {

    private final StagiaireRepository stagiaireRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public List<Stagiaire> getAllStagiaires() {
        return stagiaireRepository.findAll();
    }

    public Stagiaire getStagiaireById(Long id) {
        return stagiaireRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stagiaire non trouvé avec id : " + id));
    }

    public Stagiaire createStagiaire(Stagiaire stagiaire) {
        Role role = roleRepository.findByName(Role.RoleName.ROLE_STAGIAIRE)
                .orElseGet(() -> roleRepository.save(
                        Role.builder().name(Role.RoleName.ROLE_STAGIAIRE).build()
                ));
        Set<Role> roles = new HashSet<>();
        roles.add(role);
        stagiaire.setRoles(roles);
        stagiaire.setPassword(passwordEncoder.encode(stagiaire.getPassword()));
        return stagiaireRepository.save(stagiaire);
    }

    public Stagiaire updateStagiaire(Long id, Stagiaire updatedStagiaire) {
        Stagiaire stagiaire = getStagiaireById(id);
        stagiaire.setNom(updatedStagiaire.getNom());
        stagiaire.setPrenom(updatedStagiaire.getPrenom());
        stagiaire.setEmail(updatedStagiaire.getEmail());
        stagiaire.setUniversite(updatedStagiaire.getUniversite());
        stagiaire.setSpecialite(updatedStagiaire.getSpecialite());
        stagiaire.setDateDebut(updatedStagiaire.getDateDebut());
        stagiaire.setDateFin(updatedStagiaire.getDateFin());
        stagiaire.setStatut(updatedStagiaire.getStatut());
        return stagiaireRepository.save(stagiaire);
    }

    public void deleteStagiaire(Long id) {
        stagiaireRepository.deleteById(id);
    }

    public List<Stagiaire> getStagiairesByStatut(Stagiaire.StatutStage statut) {
        return stagiaireRepository.findByStatut(statut);
    }
}