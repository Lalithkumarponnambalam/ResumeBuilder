package com.resume.build.repository;

import com.resume.build.domain.AreaofInterest;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the AreaofInterest entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AreaofInterestRepository extends JpaRepository<AreaofInterest, Long> {}
