package com.fraudguard.backend.repository;

import com.fraudguard.backend.entity.InvestigationNote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvestigationNoteRepository extends JpaRepository<InvestigationNote, Long> {

    List<InvestigationNote> findByTransactionIdOrderByCreatedAtDesc(Long transactionId);
}