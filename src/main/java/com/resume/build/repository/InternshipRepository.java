package com.resume.build.repository;

import com.resume.build.domain.Internship;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Internship entity.
 */
@SuppressWarnings("unused")
@Repository
public interface InternshipRepository extends JpaRepository<Internship, Long> {}
