package com.jobgate.service;

import com.jobgate.entity.Evaluation;
import com.jobgate.entity.Stagiaire;
import com.jobgate.repository.EvaluationRepository;
import com.jobgate.repository.StagiaireRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EvaluationService {

    private final EvaluationRepository evaluationRepository;
    private final StagiaireRepository stagiaireRepository;

    public List<Evaluation> getAllEvaluations() {
        return evaluationRepository.findAll();
    }

    public Evaluation getEvaluationById(Long id) {
        return evaluationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evaluation non trouvée avec id : " + id));
    }

    public Evaluation createEvaluation(Evaluation evaluation) {
        return evaluationRepository.save(evaluation);
    }

    public Evaluation updateEvaluation(Long id, Evaluation updatedEvaluation) {
        Evaluation evaluation = getEvaluationById(id);
        evaluation.setNote(updatedEvaluation.getNote());
        evaluation.setCommentaire(updatedEvaluation.getCommentaire());
        evaluation.setDateEvaluation(updatedEvaluation.getDateEvaluation());
        return evaluationRepository.save(evaluation);
    }

    public void deleteEvaluation(Long id) {
        evaluationRepository.deleteById(id);
    }

    public List<Evaluation> getEvaluationsByStagiaire(Long stagiaireId) {
        Stagiaire stagiaire = stagiaireRepository.findById(stagiaireId)
                .orElseThrow(() -> new RuntimeException("Stagiaire non trouvé"));
        return evaluationRepository.findByStagiaire(stagiaire);
    }
}