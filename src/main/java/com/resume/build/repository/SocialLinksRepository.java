package com.resume.build.repository;

import com.resume.build.domain.SocialLinks;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the SocialLinks entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SocialLinksRepository extends JpaRepository<SocialLinks, Long> {}
