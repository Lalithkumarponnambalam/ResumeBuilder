package com.resume.build.web.rest;

import com.resume.build.domain.SocialLinks;
import com.resume.build.repository.SocialLinksRepository;
import com.resume.build.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.resume.build.domain.SocialLinks}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SocialLinksResource {

    private final Logger log = LoggerFactory.getLogger(SocialLinksResource.class);

    private static final String ENTITY_NAME = "socialLinks";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SocialLinksRepository socialLinksRepository;

    public SocialLinksResource(SocialLinksRepository socialLinksRepository) {
        this.socialLinksRepository = socialLinksRepository;
    }

    /**
     * {@code POST  /social-links} : Create a new socialLinks.
     *
     * @param socialLinks the socialLinks to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new socialLinks, or with status {@code 400 (Bad Request)} if the socialLinks has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/social-links")
    public ResponseEntity<SocialLinks> createSocialLinks(@RequestBody SocialLinks socialLinks) throws URISyntaxException {
        log.debug("REST request to save SocialLinks : {}", socialLinks);
        if (socialLinks.getId() != null) {
            throw new BadRequestAlertException("A new socialLinks cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SocialLinks result = socialLinksRepository.save(socialLinks);
        return ResponseEntity
            .created(new URI("/api/social-links/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /social-links/:id} : Updates an existing socialLinks.
     *
     * @param id the id of the socialLinks to save.
     * @param socialLinks the socialLinks to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated socialLinks,
     * or with status {@code 400 (Bad Request)} if the socialLinks is not valid,
     * or with status {@code 500 (Internal Server Error)} if the socialLinks couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/social-links/{id}")
    public ResponseEntity<SocialLinks> updateSocialLinks(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SocialLinks socialLinks
    ) throws URISyntaxException {
        log.debug("REST request to update SocialLinks : {}, {}", id, socialLinks);
        if (socialLinks.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, socialLinks.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!socialLinksRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SocialLinks result = socialLinksRepository.save(socialLinks);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, socialLinks.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /social-links/:id} : Partial updates given fields of an existing socialLinks, field will ignore if it is null
     *
     * @param id the id of the socialLinks to save.
     * @param socialLinks the socialLinks to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated socialLinks,
     * or with status {@code 400 (Bad Request)} if the socialLinks is not valid,
     * or with status {@code 404 (Not Found)} if the socialLinks is not found,
     * or with status {@code 500 (Internal Server Error)} if the socialLinks couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/social-links/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SocialLinks> partialUpdateSocialLinks(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SocialLinks socialLinks
    ) throws URISyntaxException {
        log.debug("REST request to partial update SocialLinks partially : {}, {}", id, socialLinks);
        if (socialLinks.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, socialLinks.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!socialLinksRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SocialLinks> result = socialLinksRepository
            .findById(socialLinks.getId())
            .map(existingSocialLinks -> {
                if (socialLinks.getLable() != null) {
                    existingSocialLinks.setLable(socialLinks.getLable());
                }
                if (socialLinks.getLink() != null) {
                    existingSocialLinks.setLink(socialLinks.getLink());
                }

                return existingSocialLinks;
            })
            .map(socialLinksRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, socialLinks.getId().toString())
        );
    }

    /**
     * {@code GET  /social-links} : get all the socialLinks.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of socialLinks in body.
     */
    @GetMapping("/social-links")
    public List<SocialLinks> getAllSocialLinks() {
        log.debug("REST request to get all SocialLinks");
        return socialLinksRepository.findAll();
    }

    /**
     * {@code GET  /social-links/:id} : get the "id" socialLinks.
     *
     * @param id the id of the socialLinks to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the socialLinks, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/social-links/{id}")
    public ResponseEntity<SocialLinks> getSocialLinks(@PathVariable Long id) {
        log.debug("REST request to get SocialLinks : {}", id);
        Optional<SocialLinks> socialLinks = socialLinksRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(socialLinks);
    }

    /**
     * {@code DELETE  /social-links/:id} : delete the "id" socialLinks.
     *
     * @param id the id of the socialLinks to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/social-links/{id}")
    public ResponseEntity<Void> deleteSocialLinks(@PathVariable Long id) {
        log.debug("REST request to delete SocialLinks : {}", id);
        socialLinksRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
