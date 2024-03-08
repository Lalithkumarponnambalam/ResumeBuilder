package com.resume.build.web.rest;

import com.resume.build.domain.CertificationDetails;
import com.resume.build.repository.CertificationDetailsRepository;
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
 * REST controller for managing {@link com.resume.build.domain.CertificationDetails}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CertificationDetailsResource {

    private final Logger log = LoggerFactory.getLogger(CertificationDetailsResource.class);

    private static final String ENTITY_NAME = "certificationDetails";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CertificationDetailsRepository certificationDetailsRepository;

    public CertificationDetailsResource(CertificationDetailsRepository certificationDetailsRepository) {
        this.certificationDetailsRepository = certificationDetailsRepository;
    }

    /**
     * {@code POST  /certification-details} : Create a new certificationDetails.
     *
     * @param certificationDetails the certificationDetails to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new certificationDetails, or with status {@code 400 (Bad Request)} if the certificationDetails has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/certification-details")
    public ResponseEntity<CertificationDetails> createCertificationDetails(@RequestBody CertificationDetails certificationDetails)
        throws URISyntaxException {
        log.debug("REST request to save CertificationDetails : {}", certificationDetails);
        if (certificationDetails.getId() != null) {
            throw new BadRequestAlertException("A new certificationDetails cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CertificationDetails result = certificationDetailsRepository.save(certificationDetails);
        return ResponseEntity
            .created(new URI("/api/certification-details/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /certification-details/:id} : Updates an existing certificationDetails.
     *
     * @param id the id of the certificationDetails to save.
     * @param certificationDetails the certificationDetails to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated certificationDetails,
     * or with status {@code 400 (Bad Request)} if the certificationDetails is not valid,
     * or with status {@code 500 (Internal Server Error)} if the certificationDetails couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/certification-details/{id}")
    public ResponseEntity<CertificationDetails> updateCertificationDetails(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CertificationDetails certificationDetails
    ) throws URISyntaxException {
        log.debug("REST request to update CertificationDetails : {}, {}", id, certificationDetails);
        if (certificationDetails.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, certificationDetails.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!certificationDetailsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CertificationDetails result = certificationDetailsRepository.save(certificationDetails);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, certificationDetails.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /certification-details/:id} : Partial updates given fields of an existing certificationDetails, field will ignore if it is null
     *
     * @param id the id of the certificationDetails to save.
     * @param certificationDetails the certificationDetails to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated certificationDetails,
     * or with status {@code 400 (Bad Request)} if the certificationDetails is not valid,
     * or with status {@code 404 (Not Found)} if the certificationDetails is not found,
     * or with status {@code 500 (Internal Server Error)} if the certificationDetails couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/certification-details/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CertificationDetails> partialUpdateCertificationDetails(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CertificationDetails certificationDetails
    ) throws URISyntaxException {
        log.debug("REST request to partial update CertificationDetails partially : {}, {}", id, certificationDetails);
        if (certificationDetails.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, certificationDetails.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!certificationDetailsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CertificationDetails> result = certificationDetailsRepository
            .findById(certificationDetails.getId())
            .map(existingCertificationDetails -> {
                if (certificationDetails.getCertificateName() != null) {
                    existingCertificationDetails.setCertificateName(certificationDetails.getCertificateName());
                }
                if (certificationDetails.getInstitution() != null) {
                    existingCertificationDetails.setInstitution(certificationDetails.getInstitution());
                }
                if (certificationDetails.getCertificateDate() != null) {
                    existingCertificationDetails.setCertificateDate(certificationDetails.getCertificateDate());
                }
                if (certificationDetails.getCertificationSummary() != null) {
                    existingCertificationDetails.setCertificationSummary(certificationDetails.getCertificationSummary());
                }

                return existingCertificationDetails;
            })
            .map(certificationDetailsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, certificationDetails.getId().toString())
        );
    }

    /**
     * {@code GET  /certification-details} : get all the certificationDetails.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of certificationDetails in body.
     */
    @GetMapping("/certification-details")
    public List<CertificationDetails> getAllCertificationDetails() {
        log.debug("REST request to get all CertificationDetails");
        return certificationDetailsRepository.findAll();
    }

    /**
     * {@code GET  /certification-details/:id} : get the "id" certificationDetails.
     *
     * @param id the id of the certificationDetails to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the certificationDetails, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/certification-details/{id}")
    public ResponseEntity<CertificationDetails> getCertificationDetails(@PathVariable Long id) {
        log.debug("REST request to get CertificationDetails : {}", id);
        Optional<CertificationDetails> certificationDetails = certificationDetailsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(certificationDetails);
    }

    /**
     * {@code DELETE  /certification-details/:id} : delete the "id" certificationDetails.
     *
     * @param id the id of the certificationDetails to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/certification-details/{id}")
    public ResponseEntity<Void> deleteCertificationDetails(@PathVariable Long id) {
        log.debug("REST request to delete CertificationDetails : {}", id);
        certificationDetailsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
