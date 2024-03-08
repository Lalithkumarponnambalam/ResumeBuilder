package com.resume.build.repository;

import com.resume.build.domain.PersonalDetails;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the PersonalDetails entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PersonalDetailsRepository extends JpaRepository<PersonalDetails, Long> {}
