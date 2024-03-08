package com.resume.build.repository;

import com.resume.build.domain.KeySkills;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the KeySkills entity.
 */
@SuppressWarnings("unused")
@Repository
public interface KeySkillsRepository extends JpaRepository<KeySkills, Long> {}
