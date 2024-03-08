package com.resume.build.web.rest;

import com.resume.build.domain.KeySkills;
import com.resume.build.repository.KeySkillsRepository;
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
 * REST controller for managing {@link com.resume.build.domain.KeySkills}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class KeySkillsResource {

    private final Logger log = LoggerFactory.getLogger(KeySkillsResource.class);

    private static final String ENTITY_NAME = "keySkills";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final KeySkillsRepository keySkillsRepository;

    public KeySkillsResource(KeySkillsRepository keySkillsRepository) {
        this.keySkillsRepository = keySkillsRepository;
    }

    /**
     * {@code POST  /key-skills} : Create a new keySkills.
     *
     * @param keySkills the keySkills to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new keySkills, or with status {@code 400 (Bad Request)} if the keySkills has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/key-skills")
    public ResponseEntity<KeySkills> createKeySkills(@RequestBody KeySkills keySkills) throws URISyntaxException {
        log.debug("REST request to save KeySkills : {}", keySkills);
        if (keySkills.getId() != null) {
            throw new BadRequestAlertException("A new keySkills cannot already have an ID", ENTITY_NAME, "idexists");
        }
        KeySkills result = keySkillsRepository.save(keySkills);
        return ResponseEntity
            .created(new URI("/api/key-skills/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /key-skills/:id} : Updates an existing keySkills.
     *
     * @param id the id of the keySkills to save.
     * @param keySkills the keySkills to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated keySkills,
     * or with status {@code 400 (Bad Request)} if the keySkills is not valid,
     * or with status {@code 500 (Internal Server Error)} if the keySkills couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/key-skills/{id}")
    public ResponseEntity<KeySkills> updateKeySkills(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody KeySkills keySkills
    ) throws URISyntaxException {
        log.debug("REST request to update KeySkills : {}, {}", id, keySkills);
        if (keySkills.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, keySkills.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!keySkillsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        KeySkills result = keySkillsRepository.save(keySkills);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, keySkills.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /key-skills/:id} : Partial updates given fields of an existing keySkills, field will ignore if it is null
     *
     * @param id the id of the keySkills to save.
     * @param keySkills the keySkills to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated keySkills,
     * or with status {@code 400 (Bad Request)} if the keySkills is not valid,
     * or with status {@code 404 (Not Found)} if the keySkills is not found,
     * or with status {@code 500 (Internal Server Error)} if the keySkills couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/key-skills/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<KeySkills> partialUpdateKeySkills(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody KeySkills keySkills
    ) throws URISyntaxException {
        log.debug("REST request to partial update KeySkills partially : {}, {}", id, keySkills);
        if (keySkills.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, keySkills.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!keySkillsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<KeySkills> result = keySkillsRepository
            .findById(keySkills.getId())
            .map(existingKeySkills -> {
                if (keySkills.getKeySkillsSummary() != null) {
                    existingKeySkills.setKeySkillsSummary(keySkills.getKeySkillsSummary());
                }

                return existingKeySkills;
            })
            .map(keySkillsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, keySkills.getId().toString())
        );
    }

    /**
     * {@code GET  /key-skills} : get all the keySkills.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of keySkills in body.
     */
    @GetMapping("/key-skills")
    public List<KeySkills> getAllKeySkills() {
        log.debug("REST request to get all KeySkills");
        return keySkillsRepository.findAll();
    }

    /**
     * {@code GET  /key-skills/:id} : get the "id" keySkills.
     *
     * @param id the id of the keySkills to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the keySkills, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/key-skills/{id}")
    public ResponseEntity<KeySkills> getKeySkills(@PathVariable Long id) {
        log.debug("REST request to get KeySkills : {}", id);
        Optional<KeySkills> keySkills = keySkillsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(keySkills);
    }

    /**
     * {@code DELETE  /key-skills/:id} : delete the "id" keySkills.
     *
     * @param id the id of the keySkills to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/key-skills/{id}")
    public ResponseEntity<Void> deleteKeySkills(@PathVariable Long id) {
        log.debug("REST request to delete KeySkills : {}", id);
        keySkillsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
