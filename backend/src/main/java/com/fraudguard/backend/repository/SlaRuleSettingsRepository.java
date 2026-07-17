package com.fraudguard.backend.repository;

import com.fraudguard.backend.entity.SlaRuleSettings;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SlaRuleSettingsRepository extends JpaRepository<SlaRuleSettings, Long> {
}