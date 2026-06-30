package com.jobgate.service;

import com.jobgate.entity.ResponsableRH;
import com.jobgate.entity.Role;
import com.jobgate.repository.ResponsableRHRepository;
import com.jobgate.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ResponsableRHService {

    private final ResponsableRHRepository responsableRHRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public List<ResponsableRH> getAllResponsables() {
        return responsableRHRepository.findAll();
    }

    public ResponsableRH getResponsableById(Long id) {
        return responsableRHRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Responsable RH non trouvé avec id : " + id));
    }

    public ResponsableRH createResponsable(ResponsableRH responsable) {
        Role role = roleRepository.findByName(Role.RoleName.ROLE_RH)
                .orElseGet(() -> roleRepository.save(
                        Role.builder().name(Role.RoleName.ROLE_RH).build()
                ));
        Set<Role> roles = new HashSet<>();
        roles.add(role);
        responsable.setRoles(roles);
        responsable.setPassword(passwordEncoder.encode(responsable.getPassword()));
        return responsableRHRepository.save(responsable);
    }

    public ResponsableRH updateResponsable(Long id, ResponsableRH updatedResponsable) {
        ResponsableRH responsable = getResponsableById(id);
        responsable.setNom(updatedResponsable.getNom());
        responsable.setPrenom(updatedResponsable.getPrenom());
        responsable.setEmail(updatedResponsable.getEmail());
        responsable.setDepartement(updatedResponsable.getDepartement());
        responsable.setPoste(updatedResponsable.getPoste());
        return responsableRHRepository.save(responsable);
    }

    public void deleteResponsable(Long id) {
        responsableRHRepository.deleteById(id);
    }
}