package com.jobgate.repository;

import com.jobgate.entity.Feedback;
import com.jobgate.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByDestinataire(User destinataire);
    List<Feedback> findByExpediteur(User expediteur);
}