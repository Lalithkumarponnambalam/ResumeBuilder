package com.resume.build.repository;

import com.resume.build.domain.Languages;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Languages entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LanguagesRepository extends JpaRepository<Languages, Long> {}
