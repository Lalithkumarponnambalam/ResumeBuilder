package com.resume.build.web.rest;

import com.resume.build.domain.Internship;
import com.resume.build.repository.InternshipRepository;
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
 * REST controller for managing {@link com.resume.build.domain.Internship}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class InternshipResource {

    private final Logger log = LoggerFactory.getLogger(InternshipResource.class);

    private static final String ENTITY_NAME = "internship";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final InternshipRepository internshipRepository;

    public InternshipResource(InternshipRepository internshipRepository) {
        this.internshipRepository = internshipRepository;
    }

    /**
     * {@code POST  /internships} : Create a new internship.
     *
     * @param internship the internship to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new internship, or with status {@code 400 (Bad Request)} if the internship has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/internships")
    public ResponseEntity<Internship> createInternship(@RequestBody Internship internship) throws URISyntaxException {
        log.debug("REST request to save Internship : {}", internship);
        if (internship.getId() != null) {
            throw new BadRequestAlertException("A new internship cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Internship result = internshipRepository.save(internship);
        return ResponseEntity
            .created(new URI("/api/internships/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /internships/:id} : Updates an existing internship.
     *
     * @param id the id of the internship to save.
     * @param internship the internship to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated internship,
     * or with status {@code 400 (Bad Request)} if the internship is not valid,
     * or with status {@code 500 (Internal Server Error)} if the internship couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/internships/{id}")
    public ResponseEntity<Internship> updateInternship(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Internship internship
    ) throws URISyntaxException {
        log.debug("REST request to update Internship : {}, {}", id, internship);
        if (internship.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, internship.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!internshipRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Internship result = internshipRepository.save(internship);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, internship.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /internships/:id} : Partial updates given fields of an existing internship, field will ignore if it is null
     *
     * @param id the id of the internship to save.
     * @param internship the internship to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated internship,
     * or with status {@code 400 (Bad Request)} if the internship is not valid,
     * or with status {@code 404 (Not Found)} if the internship is not found,
     * or with status {@code 500 (Internal Server Error)} if the internship couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/internships/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Internship> partialUpdateInternship(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Internship internship
    ) throws URISyntaxException {
        log.debug("REST request to partial update Internship partially : {}, {}", id, internship);
        if (internship.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, internship.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!internshipRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Internship> result = internshipRepository
            .findById(internship.getId())
            .map(existingInternship -> {
                if (internship.getJobTitle() != null) {
                    existingInternship.setJobTitle(internship.getJobTitle());
                }
                if (internship.getEmployer() != null) {
                    existingInternship.setEmployer(internship.getEmployer());
                }
                if (internship.getCompanyName() != null) {
                    existingInternship.setCompanyName(internship.getCompanyName());
                }
                if (internship.getAddress() != null) {
                    existingInternship.setAddress(internship.getAddress());
                }
                if (internship.getStartDate() != null) {
                    existingInternship.setStartDate(internship.getStartDate());
                }
                if (internship.getEndDate() != null) {
                    existingInternship.setEndDate(internship.getEndDate());
                }
                if (internship.getInternshipSummary() != null) {
                    existingInternship.setInternshipSummary(internship.getInternshipSummary());
                }

                return existingInternship;
            })
            .map(internshipRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, internship.getId().toString())
        );
    }

    /**
     * {@code GET  /internships} : get all the internships.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of internships in body.
     */
    @GetMapping("/internships")
    public List<Internship> getAllInternships() {
        log.debug("REST request to get all Internships");
        return internshipRepository.findAll();
    }

    /**
     * {@code GET  /internships/:id} : get the "id" internship.
     *
     * @param id the id of the internship to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the internship, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/internships/{id}")
    public ResponseEntity<Internship> getInternship(@PathVariable Long id) {
        log.debug("REST request to get Internship : {}", id);
        Optional<Internship> internship = internshipRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(internship);
    }

    /**
     * {@code DELETE  /internships/:id} : delete the "id" internship.
     *
     * @param id the id of the internship to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/internships/{id}")
    public ResponseEntity<Void> deleteInternship(@PathVariable Long id) {
        log.debug("REST request to delete Internship : {}", id);
        internshipRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
