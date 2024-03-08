package com.resume.build.web.rest;

import com.resume.build.domain.WorkDetails;
import com.resume.build.repository.WorkDetailsRepository;
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
 * REST controller for managing {@link com.resume.build.domain.WorkDetails}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class WorkDetailsResource {

    private final Logger log = LoggerFactory.getLogger(WorkDetailsResource.class);

    private static final String ENTITY_NAME = "workDetails";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final WorkDetailsRepository workDetailsRepository;

    public WorkDetailsResource(WorkDetailsRepository workDetailsRepository) {
        this.workDetailsRepository = workDetailsRepository;
    }

    /**
     * {@code POST  /work-details} : Create a new workDetails.
     *
     * @param workDetails the workDetails to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new workDetails, or with status {@code 400 (Bad Request)} if the workDetails has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/work-details")
    public ResponseEntity<WorkDetails> createWorkDetails(@Valid @RequestBody WorkDetails workDetails) throws URISyntaxException {
        log.debug("REST request to save WorkDetails : {}", workDetails);
        if (workDetails.getId() != null) {
            throw new BadRequestAlertException("A new workDetails cannot already have an ID", ENTITY_NAME, "idexists");
        }
        WorkDetails result = workDetailsRepository.save(workDetails);
        return ResponseEntity
            .created(new URI("/api/work-details/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /work-details/:id} : Updates an existing workDetails.
     *
     * @param id the id of the workDetails to save.
     * @param workDetails the workDetails to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated workDetails,
     * or with status {@code 400 (Bad Request)} if the workDetails is not valid,
     * or with status {@code 500 (Internal Server Error)} if the workDetails couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/work-details/{id}")
    public ResponseEntity<WorkDetails> updateWorkDetails(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody WorkDetails workDetails
    ) throws URISyntaxException {
        log.debug("REST request to update WorkDetails : {}, {}", id, workDetails);
        if (workDetails.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, workDetails.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!workDetailsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        WorkDetails result = workDetailsRepository.save(workDetails);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, workDetails.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /work-details/:id} : Partial updates given fields of an existing workDetails, field will ignore if it is null
     *
     * @param id the id of the workDetails to save.
     * @param workDetails the workDetails to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated workDetails,
     * or with status {@code 400 (Bad Request)} if the workDetails is not valid,
     * or with status {@code 404 (Not Found)} if the workDetails is not found,
     * or with status {@code 500 (Internal Server Error)} if the workDetails couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/work-details/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<WorkDetails> partialUpdateWorkDetails(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody WorkDetails workDetails
    ) throws URISyntaxException {
        log.debug("REST request to partial update WorkDetails partially : {}, {}", id, workDetails);
        if (workDetails.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, workDetails.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!workDetailsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<WorkDetails> result = workDetailsRepository
            .findById(workDetails.getId())
            .map(existingWorkDetails -> {
                if (workDetails.getJobTitle() != null) {
                    existingWorkDetails.setJobTitle(workDetails.getJobTitle());
                }
                if (workDetails.getPosition() != null) {
                    existingWorkDetails.setPosition(workDetails.getPosition());
                }
                if (workDetails.getCompanyName() != null) {
                    existingWorkDetails.setCompanyName(workDetails.getCompanyName());
                }
                if (workDetails.getCity() != null) {
                    existingWorkDetails.setCity(workDetails.getCity());
                }
                if (workDetails.getState() != null) {
                    existingWorkDetails.setState(workDetails.getState());
                }
                if (workDetails.getStartDate() != null) {
                    existingWorkDetails.setStartDate(workDetails.getStartDate());
                }
                if (workDetails.getEndDate() != null) {
                    existingWorkDetails.setEndDate(workDetails.getEndDate());
                }
                if (workDetails.getWorkSummary() != null) {
                    existingWorkDetails.setWorkSummary(workDetails.getWorkSummary());
                }

                return existingWorkDetails;
            })
            .map(workDetailsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, workDetails.getId().toString())
        );
    }

    /**
     * {@code GET  /work-details} : get all the workDetails.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of workDetails in body.
     */
    @GetMapping("/work-details")
    public List<WorkDetails> getAllWorkDetails() {
        log.debug("REST request to get all WorkDetails");
        return workDetailsRepository.findAll();
    }

    /**
     * {@code GET  /work-details/:id} : get the "id" workDetails.
     *
     * @param id the id of the workDetails to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the workDetails, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/work-details/{id}")
    public ResponseEntity<WorkDetails> getWorkDetails(@PathVariable Long id) {
        log.debug("REST request to get WorkDetails : {}", id);
        Optional<WorkDetails> workDetails = workDetailsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(workDetails);
    }

    /**
     * {@code DELETE  /work-details/:id} : delete the "id" workDetails.
     *
     * @param id the id of the workDetails to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/work-details/{id}")
    public ResponseEntity<Void> deleteWorkDetails(@PathVariable Long id) {
        log.debug("REST request to delete WorkDetails : {}", id);
        workDetailsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
