package com.resume.build.repository;

import com.resume.build.domain.CertificationDetails;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the CertificationDetails entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CertificationDetailsRepository extends JpaRepository<CertificationDetails, Long> {}
