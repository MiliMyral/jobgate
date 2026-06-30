package com.jobgate.controller;

import com.jobgate.entity.ResponsableRH;
import com.jobgate.service.ResponsableRHService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/responsables")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class ResponsableRHController {

    private final ResponsableRHService responsableRHService;

    @GetMapping
    public ResponseEntity<List<ResponsableRH>> getAllResponsables() {
        return ResponseEntity.ok(responsableRHService.getAllResponsables());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponsableRH> getResponsableById(@PathVariable Long id) {
        return ResponseEntity.ok(responsableRHService.getResponsableById(id));
    }

    @PostMapping
    public ResponseEntity<ResponsableRH> createResponsable(@RequestBody ResponsableRH responsable) {
        return ResponseEntity.ok(responsableRHService.createResponsable(responsable));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponsableRH> updateResponsable(@PathVariable Long id,
                                                           @RequestBody ResponsableRH responsable) {
        return ResponseEntity.ok(responsableRHService.updateResponsable(id, responsable));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResponsable(@PathVariable Long id) {
        responsableRHService.deleteResponsable(id);
        return ResponseEntity.noContent().build();
    }
}