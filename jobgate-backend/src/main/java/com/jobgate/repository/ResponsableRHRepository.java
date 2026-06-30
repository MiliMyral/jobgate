package com.jobgate.repository;

import com.jobgate.entity.ResponsableRH;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResponsableRHRepository extends JpaRepository<ResponsableRH, Long> {
    List<ResponsableRH> findByDepartement(String departement);
}