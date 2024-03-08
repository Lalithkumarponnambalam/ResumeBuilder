package com.resume.build.repository;

import com.resume.build.domain.EducationDetails;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the EducationDetails entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EducationDetailsRepository extends JpaRepository<EducationDetails, Long> {}
