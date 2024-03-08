package com.resume.build.web.rest;

import com.resume.build.domain.ExperienceDetails;
import com.resume.build.repository.ExperienceDetailsRepository;
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
 * REST controller for managing {@link com.resume.build.domain.ExperienceDetails}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ExperienceDetailsResource {

    private final Logger log = LoggerFactory.getLogger(ExperienceDetailsResource.class);

    private static final String ENTITY_NAME = "experienceDetails";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ExperienceDetailsRepository experienceDetailsRepository;

    public ExperienceDetailsResource(ExperienceDetailsRepository experienceDetailsRepository) {
        this.experienceDetailsRepository = experienceDetailsRepository;
    }

    /**
     * {@code POST  /experience-details} : Create a new experienceDetails.
     *
     * @param experienceDetails the experienceDetails to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new experienceDetails, or with status {@code 400 (Bad Request)} if the experienceDetails has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/experience-details")
    public ResponseEntity<ExperienceDetails> createExperienceDetails(@RequestBody ExperienceDetails experienceDetails)
        throws URISyntaxException {
        log.debug("REST request to save ExperienceDetails : {}", experienceDetails);
        if (experienceDetails.getId() != null) {
            throw new BadRequestAlertException("A new experienceDetails cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ExperienceDetails result = experienceDetailsRepository.save(experienceDetails);
        return ResponseEntity
            .created(new URI("/api/experience-details/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /experience-details/:id} : Updates an existing experienceDetails.
     *
     * @param id the id of the experienceDetails to save.
     * @param experienceDetails the experienceDetails to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated experienceDetails,
     * or with status {@code 400 (Bad Request)} if the experienceDetails is not valid,
     * or with status {@code 500 (Internal Server Error)} if the experienceDetails couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/experience-details/{id}")
    public ResponseEntity<ExperienceDetails> updateExperienceDetails(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ExperienceDetails experienceDetails
    ) throws URISyntaxException {
        log.debug("REST request to update ExperienceDetails : {}, {}", id, experienceDetails);
        if (experienceDetails.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, experienceDetails.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!experienceDetailsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ExperienceDetails result = experienceDetailsRepository.save(experienceDetails);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, experienceDetails.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /experience-details/:id} : Partial updates given fields of an existing experienceDetails, field will ignore if it is null
     *
     * @param id the id of the experienceDetails to save.
     * @param experienceDetails the experienceDetails to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated experienceDetails,
     * or with status {@code 400 (Bad Request)} if the experienceDetails is not valid,
     * or with status {@code 404 (Not Found)} if the experienceDetails is not found,
     * or with status {@code 500 (Internal Server Error)} if the experienceDetails couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/experience-details/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ExperienceDetails> partialUpdateExperienceDetails(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ExperienceDetails experienceDetails
    ) throws URISyntaxException {
        log.debug("REST request to partial update ExperienceDetails partially : {}, {}", id, experienceDetails);
        if (experienceDetails.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, experienceDetails.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!experienceDetailsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ExperienceDetails> result = experienceDetailsRepository
            .findById(experienceDetails.getId())
            .map(existingExperienceDetails -> {
                if (experienceDetails.getPositionTitle() != null) {
                    existingExperienceDetails.setPositionTitle(experienceDetails.getPositionTitle());
                }
                if (experienceDetails.getCompanyName() != null) {
                    existingExperienceDetails.setCompanyName(experienceDetails.getCompanyName());
                }
                if (experienceDetails.getStartDate() != null) {
                    existingExperienceDetails.setStartDate(experienceDetails.getStartDate());
                }
                if (experienceDetails.getEndDate() != null) {
                    existingExperienceDetails.setEndDate(experienceDetails.getEndDate());
                }
                if (experienceDetails.getWorkSummary() != null) {
                    existingExperienceDetails.setWorkSummary(experienceDetails.getWorkSummary());
                }

                return existingExperienceDetails;
            })
            .map(experienceDetailsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, experienceDetails.getId().toString())
        );
    }

    /**
     * {@code GET  /experience-details} : get all the experienceDetails.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of experienceDetails in body.
     */
    @GetMapping("/experience-details")
    public List<ExperienceDetails> getAllExperienceDetails() {
        log.debug("REST request to get all ExperienceDetails");
        return experienceDetailsRepository.findAll();
    }

    /**
     * {@code GET  /experience-details/:id} : get the "id" experienceDetails.
     *
     * @param id the id of the experienceDetails to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the experienceDetails, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/experience-details/{id}")
    public ResponseEntity<ExperienceDetails> getExperienceDetails(@PathVariable Long id) {
        log.debug("REST request to get ExperienceDetails : {}", id);
        Optional<ExperienceDetails> experienceDetails = experienceDetailsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(experienceDetails);
    }

    /**
     * {@code DELETE  /experience-details/:id} : delete the "id" experienceDetails.
     *
     * @param id the id of the experienceDetails to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/experience-details/{id}")
    public ResponseEntity<Void> deleteExperienceDetails(@PathVariable Long id) {
        log.debug("REST request to delete ExperienceDetails : {}", id);
        experienceDetailsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
