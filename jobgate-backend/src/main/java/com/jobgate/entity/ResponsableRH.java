package com.jobgate.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "responsables_rh")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@PrimaryKeyJoinColumn(name = "user_id")
public class ResponsableRH extends User {

    @Column(nullable = false)
    private String departement;

    @Column(nullable = false)
    private String poste;

    private String telephone;
}