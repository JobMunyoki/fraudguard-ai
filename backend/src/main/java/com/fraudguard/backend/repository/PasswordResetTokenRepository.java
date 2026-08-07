package com.fraudguard.backend.repository;

import com.fraudguard.backend.entity.AppUser;
import com.fraudguard.backend.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PasswordResetTokenRepository
        extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByTokenHash(
            String tokenHash);

    List<PasswordResetToken> findAllByUserAndUsedAtIsNull(
            AppUser user);

    Optional<PasswordResetToken> findTopByUserOrderByCreatedAtDesc(
            AppUser user);
}