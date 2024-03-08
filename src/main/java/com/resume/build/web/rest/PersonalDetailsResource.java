package com.resume.build.web.rest;

import com.resume.build.domain.PersonalDetails;
import com.resume.build.repository.PersonalDetailsRepository;
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
 * REST controller for managing {@link com.resume.build.domain.PersonalDetails}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PersonalDetailsResource {

    private final Logger log = LoggerFactory.getLogger(PersonalDetailsResource.class);

    private static final String ENTITY_NAME = "personalDetails";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PersonalDetailsRepository personalDetailsRepository;

    public PersonalDetailsResource(PersonalDetailsRepository personalDetailsRepository) {
        this.personalDetailsRepository = personalDetailsRepository;
    }

    /**
     * {@code POST  /personal-details} : Create a new personalDetails.
     *
     * @param personalDetails the personalDetails to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new personalDetails, or with status {@code 400 (Bad Request)} if the personalDetails has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/personal-details")
    public ResponseEntity<PersonalDetails> createPersonalDetails(@Valid @RequestBody PersonalDetails personalDetails)
        throws URISyntaxException {
        log.debug("REST request to save PersonalDetails : {}", personalDetails);
        if (personalDetails.getId() != null) {
            throw new BadRequestAlertException("A new personalDetails cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PersonalDetails result = personalDetailsRepository.save(personalDetails);
        return ResponseEntity
            .created(new URI("/api/personal-details/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /personal-details/:id} : Updates an existing personalDetails.
     *
     * @param id the id of the personalDetails to save.
     * @param personalDetails the personalDetails to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated personalDetails,
     * or with status {@code 400 (Bad Request)} if the personalDetails is not valid,
     * or with status {@code 500 (Internal Server Error)} if the personalDetails couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/personal-details/{id}")
    public ResponseEntity<PersonalDetails> updatePersonalDetails(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody PersonalDetails personalDetails
    ) throws URISyntaxException {
        log.debug("REST request to update PersonalDetails : {}, {}", id, personalDetails);
        if (personalDetails.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, personalDetails.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!personalDetailsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        PersonalDetails result = personalDetailsRepository.save(personalDetails);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, personalDetails.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /personal-details/:id} : Partial updates given fields of an existing personalDetails, field will ignore if it is null
     *
     * @param id the id of the personalDetails to save.
     * @param personalDetails the personalDetails to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated personalDetails,
     * or with status {@code 400 (Bad Request)} if the personalDetails is not valid,
     * or with status {@code 404 (Not Found)} if the personalDetails is not found,
     * or with status {@code 500 (Internal Server Error)} if the personalDetails couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/personal-details/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<PersonalDetails> partialUpdatePersonalDetails(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody PersonalDetails personalDetails
    ) throws URISyntaxException {
        log.debug("REST request to partial update PersonalDetails partially : {}, {}", id, personalDetails);
        if (personalDetails.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, personalDetails.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!personalDetailsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<PersonalDetails> result = personalDetailsRepository
            .findById(personalDetails.getId())
            .map(existingPersonalDetails -> {
                if (personalDetails.getProfilePhoto() != null) {
                    existingPersonalDetails.setProfilePhoto(personalDetails.getProfilePhoto());
                }
                if (personalDetails.getProfilePhotoContentType() != null) {
                    existingPersonalDetails.setProfilePhotoContentType(personalDetails.getProfilePhotoContentType());
                }
                if (personalDetails.getFirstName() != null) {
                    existingPersonalDetails.setFirstName(personalDetails.getFirstName());
                }
                if (personalDetails.getLastName() != null) {
                    existingPersonalDetails.setLastName(personalDetails.getLastName());
                }
                if (personalDetails.getEmail() != null) {
                    existingPersonalDetails.setEmail(personalDetails.getEmail());
                }
                if (personalDetails.getPhone() != null) {
                    existingPersonalDetails.setPhone(personalDetails.getPhone());
                }
                if (personalDetails.getAddress() != null) {
                    existingPersonalDetails.setAddress(personalDetails.getAddress());
                }
                if (personalDetails.getCity() != null) {
                    existingPersonalDetails.setCity(personalDetails.getCity());
                }
                if (personalDetails.getState() != null) {
                    existingPersonalDetails.setState(personalDetails.getState());
                }
                if (personalDetails.getZipCode() != null) {
                    existingPersonalDetails.setZipCode(personalDetails.getZipCode());
                }
                if (personalDetails.getCountry() != null) {
                    existingPersonalDetails.setCountry(personalDetails.getCountry());
                }

                return existingPersonalDetails;
            })
            .map(personalDetailsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, personalDetails.getId().toString())
        );
    }

    /**
     * {@code GET  /personal-details} : get all the personalDetails.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of personalDetails in body.
     */
    @GetMapping("/personal-details")
    public List<PersonalDetails> getAllPersonalDetails() {
        log.debug("REST request to get all PersonalDetails");
        return personalDetailsRepository.findAll();
    }

    /**
     * {@code GET  /personal-details/:id} : get the "id" personalDetails.
     *
     * @param id the id of the personalDetails to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the personalDetails, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/personal-details/{id}")
    public ResponseEntity<PersonalDetails> getPersonalDetails(@PathVariable Long id) {
        log.debug("REST request to get PersonalDetails : {}", id);
        Optional<PersonalDetails> personalDetails = personalDetailsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(personalDetails);
    }

    /**
     * {@code DELETE  /personal-details/:id} : delete the "id" personalDetails.
     *
     * @param id the id of the personalDetails to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/personal-details/{id}")
    public ResponseEntity<Void> deletePersonalDetails(@PathVariable Long id) {
        log.debug("REST request to delete PersonalDetails : {}", id);
        personalDetailsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
