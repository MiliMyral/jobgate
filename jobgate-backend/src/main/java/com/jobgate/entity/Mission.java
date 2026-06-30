package com.jobgate.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "missions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Mission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titre;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private LocalDate dateDebut;

    @Column(nullable = false)
    private LocalDate dateFin;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutMission statut = StatutMission.EN_ATTENTE;

    @ManyToOne
    @JoinColumn(name = "stagiaire_id", nullable = false)
    private Stagiaire stagiaire;

    @ManyToOne
    @JoinColumn(name = "responsable_id", nullable = false)
    private ResponsableRH responsable;

    @OneToMany(mappedBy = "mission", cascade = CascadeType.ALL)
    private List<Tache> taches;

    public enum StatutMission {
        EN_ATTENTE,
        EN_COURS,
        TERMINEE
    }
}