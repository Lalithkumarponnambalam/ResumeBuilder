package com.resume.build.web.rest;

import com.resume.build.domain.Languages;
import com.resume.build.repository.LanguagesRepository;
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
 * REST controller for managing {@link com.resume.build.domain.Languages}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class LanguagesResource {

    private final Logger log = LoggerFactory.getLogger(LanguagesResource.class);

    private static final String ENTITY_NAME = "languages";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LanguagesRepository languagesRepository;

    public LanguagesResource(LanguagesRepository languagesRepository) {
        this.languagesRepository = languagesRepository;
    }

    /**
     * {@code POST  /languages} : Create a new languages.
     *
     * @param languages the languages to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new languages, or with status {@code 400 (Bad Request)} if the languages has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/languages")
    public ResponseEntity<Languages> createLanguages(@RequestBody Languages languages) throws URISyntaxException {
        log.debug("REST request to save Languages : {}", languages);
        if (languages.getId() != null) {
            throw new BadRequestAlertException("A new languages cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Languages result = languagesRepository.save(languages);
        return ResponseEntity
            .created(new URI("/api/languages/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /languages/:id} : Updates an existing languages.
     *
     * @param id the id of the languages to save.
     * @param languages the languages to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated languages,
     * or with status {@code 400 (Bad Request)} if the languages is not valid,
     * or with status {@code 500 (Internal Server Error)} if the languages couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/languages/{id}")
    public ResponseEntity<Languages> updateLanguages(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Languages languages
    ) throws URISyntaxException {
        log.debug("REST request to update Languages : {}, {}", id, languages);
        if (languages.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, languages.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!languagesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Languages result = languagesRepository.save(languages);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, languages.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /languages/:id} : Partial updates given fields of an existing languages, field will ignore if it is null
     *
     * @param id the id of the languages to save.
     * @param languages the languages to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated languages,
     * or with status {@code 400 (Bad Request)} if the languages is not valid,
     * or with status {@code 404 (Not Found)} if the languages is not found,
     * or with status {@code 500 (Internal Server Error)} if the languages couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/languages/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Languages> partialUpdateLanguages(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Languages languages
    ) throws URISyntaxException {
        log.debug("REST request to partial update Languages partially : {}, {}", id, languages);
        if (languages.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, languages.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!languagesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Languages> result = languagesRepository
            .findById(languages.getId())
            .map(existingLanguages -> {
                if (languages.getLangOption() != null) {
                    existingLanguages.setLangOption(languages.getLangOption());
                }

                return existingLanguages;
            })
            .map(languagesRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, languages.getId().toString())
        );
    }

    /**
     * {@code GET  /languages} : get all the languages.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of languages in body.
     */
    @GetMapping("/languages")
    public List<Languages> getAllLanguages() {
        log.debug("REST request to get all Languages");
        return languagesRepository.findAll();
    }

    /**
     * {@code GET  /languages/:id} : get the "id" languages.
     *
     * @param id the id of the languages to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the languages, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/languages/{id}")
    public ResponseEntity<Languages> getLanguages(@PathVariable Long id) {
        log.debug("REST request to get Languages : {}", id);
        Optional<Languages> languages = languagesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(languages);
    }

    /**
     * {@code DELETE  /languages/:id} : delete the "id" languages.
     *
     * @param id the id of the languages to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/languages/{id}")
    public ResponseEntity<Void> deleteLanguages(@PathVariable Long id) {
        log.debug("REST request to delete Languages : {}", id);
        languagesRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
