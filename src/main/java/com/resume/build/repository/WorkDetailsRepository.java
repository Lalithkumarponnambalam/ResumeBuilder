package com.resume.build.repository;

import com.resume.build.domain.WorkDetails;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the WorkDetails entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WorkDetailsRepository extends JpaRepository<WorkDetails, Long> {}
