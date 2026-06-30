package com.jobgate.controller;

import com.jobgate.entity.Stagiaire;
import com.jobgate.service.StagiaireService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stagiaires")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class StagiaireController {

    private final StagiaireService stagiaireService;

    @GetMapping
    public ResponseEntity<List<Stagiaire>> getAllStagiaires() {
        return ResponseEntity.ok(stagiaireService.getAllStagiaires());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Stagiaire> getStagiaireById(@PathVariable Long id) {
        return ResponseEntity.ok(stagiaireService.getStagiaireById(id));
    }

    @PostMapping
    public ResponseEntity<Stagiaire> createStagiaire(@RequestBody Stagiaire stagiaire) {
        return ResponseEntity.ok(stagiaireService.createStagiaire(stagiaire));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Stagiaire> updateStagiaire(@PathVariable Long id,
                                                     @RequestBody Stagiaire stagiaire) {
        return ResponseEntity.ok(stagiaireService.updateStagiaire(id, stagiaire));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStagiaire(@PathVariable Long id) {
        stagiaireService.deleteStagiaire(id);
        return ResponseEntity.noContent().build();
    }
}