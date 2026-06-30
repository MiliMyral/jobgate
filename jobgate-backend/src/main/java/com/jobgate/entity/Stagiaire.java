package com.jobgate.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Entity
@Table(name = "stagiaires")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@PrimaryKeyJoinColumn(name = "user_id")
public class Stagiaire extends User {

    @Column(nullable = false)
    private String universite;

    @Column(nullable = false)
    private String specialite;

    @Column(nullable = false)
    private LocalDate dateDebut;

    @Column(nullable = false)
    private LocalDate dateFin;

    private String telephone;

    private String adresse;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutStage statut = StatutStage.EN_COURS;

    public enum StatutStage {
        EN_COURS,
        TERMINE,
        ABANDONNE
    }
}