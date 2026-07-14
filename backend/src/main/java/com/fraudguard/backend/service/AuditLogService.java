package com.fraudguard.backend.service;

import com.fraudguard.backend.entity.AuditLog;
import com.fraudguard.backend.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditLogService {

    private final AuditLogRepository repository;

    public AuditLogService(AuditLogRepository repository) {
        this.repository = repository;
    }

    public AuditLog createLog(
            String action,
            String transactionReference,
            String performedBy,
            String description) {
        AuditLog log = new AuditLog();

        log.setAction(action);
        log.setTransactionReference(transactionReference);
        log.setPerformedBy(performedBy);
        log.setDescription(description);

        return repository.save(log);
    }

    public List<AuditLog> getAllLogs() {
        return repository.findAllByOrderByCreatedAtDesc();
    }
}