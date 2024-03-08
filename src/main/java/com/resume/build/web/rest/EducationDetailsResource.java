package com.resume.build.web.rest;

import com.resume.build.domain.EducationDetails;
import com.resume.build.repository.EducationDetailsRepository;
import com.resume.build.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.resume.build.domain.EducationDetails}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class EducationDetailsResource {

    private final Logger log = LoggerFactory.getLogger(EducationDetailsResource.class);

    private static final String ENTITY_NAME = "educationDetails";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EducationDetailsRepository educationDetailsRepository;

    public EducationDetailsResource(EducationDetailsRepository educationDetailsRepository) {
        this.educationDetailsRepository = educationDetailsRepository;
    }

    /**
     * {@code POST  /education-details} : Create a new educationDetails.
     *
     * @param educationDetails the educationDetails to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new educationDetails, or with status {@code 400 (Bad Request)} if the educationDetails has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/education-details")
    public ResponseEntity<EducationDetails> createEducationDetails(@Valid @RequestBody EducationDetails educationDetails)
        throws URISyntaxException {
        log.debug("REST request to save EducationDetails : {}", educationDetails);
        if (educationDetails.getId() != null) {
            throw new BadRequestAlertException("A new educationDetails cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EducationDetails result = educationDetailsRepository.save(educationDetails);
        return ResponseEntity
            .created(new URI("/api/education-details/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /education-details/:id} : Updates an existing educationDetails.
     *
     * @param id the id of the educationDetails to save.
     * @param educationDetails the educationDetails to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated educationDetails,
     * or with status {@code 400 (Bad Request)} if the educationDetails is not valid,
     * or with status {@code 500 (Internal Server Error)} if the educationDetails couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/education-details/{id}")
    public ResponseEntity<EducationDetails> updateEducationDetails(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody EducationDetails educationDetails
    ) throws URISyntaxException {
        log.debug("REST request to update EducationDetails : {}, {}", id, educationDetails);
        if (educationDetails.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, educationDetails.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!educationDetailsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        EducationDetails result = educationDetailsRepository.save(educationDetails);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, educationDetails.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /education-details/:id} : Partial updates given fields of an existing educationDetails, field will ignore if it is null
     *
     * @param id the id of the educationDetails to save.
     * @param educationDetails the educationDetails to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated educationDetails,
     * or with status {@code 400 (Bad Request)} if the educationDetails is not valid,
     * or with status {@code 404 (Not Found)} if the educationDetails is not found,
     * or with status {@code 500 (Internal Server Error)} if the educationDetails couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/education-details/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<EducationDetails> partialUpdateEducationDetails(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody EducationDetails educationDetails
    ) throws URISyntaxException {
        log.debug("REST request to partial update EducationDetails partially : {}, {}", id, educationDetails);
        if (educationDetails.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, educationDetails.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!educationDetailsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<EducationDetails> result = educationDetailsRepository
            .findById(educationDetails.getId())
            .map(existingEducationDetails -> {
                if (educationDetails.getSchoolName() != null) {
                    existingEducationDetails.setSchoolName(educationDetails.getSchoolName());
                }
                if (educationDetails.getCity() != null) {
                    existingEducationDetails.setCity(educationDetails.getCity());
                }
                if (educationDetails.getState() != null) {
                    existingEducationDetails.setState(educationDetails.getState());
                }
                if (educationDetails.getStartDate() != null) {
                    existingEducationDetails.setStartDate(educationDetails.getStartDate());
                }
                if (educationDetails.getEndDate() != null) {
                    existingEducationDetails.setEndDate(educationDetails.getEndDate());
                }
                if (educationDetails.getDegree() != null) {
                    existingEducationDetails.setDegree(educationDetails.getDegree());
                }
                if (educationDetails.getFieldofStudy() != null) {
                    existingEducationDetails.setFieldofStudy(educationDetails.getFieldofStudy());
                }
                if (educationDetails.getGraduationDate() != null) {
                    existingEducationDetails.setGraduationDate(educationDetails.getGraduationDate());
                }
                if (educationDetails.getEducationSummary() != null) {
                    existingEducationDetails.setEducationSummary(educationDetails.getEducationSummary());
                }

                return existingEducationDetails;
            })
            .map(educationDetailsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, educationDetails.getId().toString())
        );
    }

    /**
     * {@code GET  /education-details} : get all the educationDetails.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of educationDetails in body.
     */
    @GetMapping("/education-details")
    public List<EducationDetails> getAllEducationDetails() {
        log.debug("REST request to get all EducationDetails");
        return educationDetailsRepository.findAll();
    }

    /**
     * {@code GET  /education-details/:id} : get the "id" educationDetails.
     *
     * @param id the id of the educationDetails to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the educationDetails, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/education-details/{id}")
    public ResponseEntity<EducationDetails> getEducationDetails(@PathVariable Long id) {
        log.debug("REST request to get EducationDetails : {}", id);
        Optional<EducationDetails> educationDetails = educationDetailsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(educationDetails);
    }

    /**
     * {@code DELETE  /education-details/:id} : delete the "id" educationDetails.
     *
     * @param id the id of the educationDetails to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/education-details/{id}")
    public ResponseEntity<Void> deleteEducationDetails(@PathVariable Long id) {
        log.debug("REST request to delete EducationDetails : {}", id);
        educationDetailsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
