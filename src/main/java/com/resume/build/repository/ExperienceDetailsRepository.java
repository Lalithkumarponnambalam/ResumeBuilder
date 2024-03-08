package com.resume.build.repository;

import com.resume.build.domain.ExperienceDetails;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ExperienceDetails entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ExperienceDetailsRepository extends JpaRepository<ExperienceDetails, Long> {}
