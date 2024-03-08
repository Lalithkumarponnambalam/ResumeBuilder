package com.resume.build.web.rest;

import com.resume.build.domain.AreaofInterest;
import com.resume.build.repository.AreaofInterestRepository;
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
 * REST controller for managing {@link com.resume.build.domain.AreaofInterest}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AreaofInterestResource {

    private final Logger log = LoggerFactory.getLogger(AreaofInterestResource.class);

    private static final String ENTITY_NAME = "areaofInterest";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AreaofInterestRepository areaofInterestRepository;

    public AreaofInterestResource(AreaofInterestRepository areaofInterestRepository) {
        this.areaofInterestRepository = areaofInterestRepository;
    }

    /**
     * {@code POST  /areaof-interests} : Create a new areaofInterest.
     *
     * @param areaofInterest the areaofInterest to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new areaofInterest, or with status {@code 400 (Bad Request)} if the areaofInterest has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/areaof-interests")
    public ResponseEntity<AreaofInterest> createAreaofInterest(@RequestBody AreaofInterest areaofInterest) throws URISyntaxException {
        log.debug("REST request to save AreaofInterest : {}", areaofInterest);
        if (areaofInterest.getId() != null) {
            throw new BadRequestAlertException("A new areaofInterest cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AreaofInterest result = areaofInterestRepository.save(areaofInterest);
        return ResponseEntity
            .created(new URI("/api/areaof-interests/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /areaof-interests/:id} : Updates an existing areaofInterest.
     *
     * @param id the id of the areaofInterest to save.
     * @param areaofInterest the areaofInterest to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated areaofInterest,
     * or with status {@code 400 (Bad Request)} if the areaofInterest is not valid,
     * or with status {@code 500 (Internal Server Error)} if the areaofInterest couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/areaof-interests/{id}")
    public ResponseEntity<AreaofInterest> updateAreaofInterest(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AreaofInterest areaofInterest
    ) throws URISyntaxException {
        log.debug("REST request to update AreaofInterest : {}, {}", id, areaofInterest);
        if (areaofInterest.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, areaofInterest.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!areaofInterestRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        AreaofInterest result = areaofInterestRepository.save(areaofInterest);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, areaofInterest.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /areaof-interests/:id} : Partial updates given fields of an existing areaofInterest, field will ignore if it is null
     *
     * @param id the id of the areaofInterest to save.
     * @param areaofInterest the areaofInterest to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated areaofInterest,
     * or with status {@code 400 (Bad Request)} if the areaofInterest is not valid,
     * or with status {@code 404 (Not Found)} if the areaofInterest is not found,
     * or with status {@code 500 (Internal Server Error)} if the areaofInterest couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/areaof-interests/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AreaofInterest> partialUpdateAreaofInterest(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AreaofInterest areaofInterest
    ) throws URISyntaxException {
        log.debug("REST request to partial update AreaofInterest partially : {}, {}", id, areaofInterest);
        if (areaofInterest.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, areaofInterest.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!areaofInterestRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AreaofInterest> result = areaofInterestRepository
            .findById(areaofInterest.getId())
            .map(existingAreaofInterest -> {
                if (areaofInterest.getIntrestSummary() != null) {
                    existingAreaofInterest.setIntrestSummary(areaofInterest.getIntrestSummary());
                }

                return existingAreaofInterest;
            })
            .map(areaofInterestRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, areaofInterest.getId().toString())
        );
    }

    /**
     * {@code GET  /areaof-interests} : get all the areaofInterests.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of areaofInterests in body.
     */
    @GetMapping("/areaof-interests")
    public List<AreaofInterest> getAllAreaofInterests() {
        log.debug("REST request to get all AreaofInterests");
        return areaofInterestRepository.findAll();
    }

    /**
     * {@code GET  /areaof-interests/:id} : get the "id" areaofInterest.
     *
     * @param id the id of the areaofInterest to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the areaofInterest, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/areaof-interests/{id}")
    public ResponseEntity<AreaofInterest> getAreaofInterest(@PathVariable Long id) {
        log.debug("REST request to get AreaofInterest : {}", id);
        Optional<AreaofInterest> areaofInterest = areaofInterestRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(areaofInterest);
    }

    /**
     * {@code DELETE  /areaof-interests/:id} : delete the "id" areaofInterest.
     *
     * @param id the id of the areaofInterest to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/areaof-interests/{id}")
    public ResponseEntity<Void> deleteAreaofInterest(@PathVariable Long id) {
        log.debug("REST request to delete AreaofInterest : {}", id);
        areaofInterestRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
