package com.ficaai.backend.repository;

import com.ficaai.backend.model.HistoricoAnalise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HistoricoRepository extends JpaRepository<HistoricoAnalise, Long> {
    // Só de estender JpaRepository, você já ganha: .save(), .findAll(), .findById()...
}