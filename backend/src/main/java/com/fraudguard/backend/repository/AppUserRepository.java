package com.fraudguard.backend.repository;

import com.fraudguard.backend.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import com.fraudguard.backend.entity.Role;
import java.util.List;

import java.util.Optional;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {

    Optional<AppUser> findByEmail(String email);

    boolean existsByEmail(String email);

    List<AppUser> findByRole(Role role);
}