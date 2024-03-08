package com.resume.build.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.resume.build.IntegrationTest;
import com.resume.build.domain.Languages;
import com.resume.build.domain.enumeration.LangOptions;
import com.resume.build.repository.LanguagesRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link LanguagesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LanguagesResourceIT {

    private static final LangOptions DEFAULT_LANG_OPTION = LangOptions.English;
    private static final LangOptions UPDATED_LANG_OPTION = LangOptions.Chinese;

    private static final String ENTITY_API_URL = "/api/languages";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LanguagesRepository languagesRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLanguagesMockMvc;

    private Languages languages;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Languages createEntity(EntityManager em) {
        Languages languages = new Languages().langOption(DEFAULT_LANG_OPTION);
        return languages;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Languages createUpdatedEntity(EntityManager em) {
        Languages languages = new Languages().langOption(UPDATED_LANG_OPTION);
        return languages;
    }

    @BeforeEach
    public void initTest() {
        languages = createEntity(em);
    }

    @Test
    @Transactional
    void createLanguages() throws Exception {
        int databaseSizeBeforeCreate = languagesRepository.findAll().size();
        // Create the Languages
        restLanguagesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(languages)))
            .andExpect(status().isCreated());

        // Validate the Languages in the database
        List<Languages> languagesList = languagesRepository.findAll();
        assertThat(languagesList).hasSize(databaseSizeBeforeCreate + 1);
        Languages testLanguages = languagesList.get(languagesList.size() - 1);
        assertThat(testLanguages.getLangOption()).isEqualTo(DEFAULT_LANG_OPTION);
    }

    @Test
    @Transactional
    void createLanguagesWithExistingId() throws Exception {
        // Create the Languages with an existing ID
        languages.setId(1L);

        int databaseSizeBeforeCreate = languagesRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLanguagesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(languages)))
            .andExpect(status().isBadRequest());

        // Validate the Languages in the database
        List<Languages> languagesList = languagesRepository.findAll();
        assertThat(languagesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllLanguages() throws Exception {
        // Initialize the database
        languagesRepository.saveAndFlush(languages);

        // Get all the languagesList
        restLanguagesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(languages.getId().intValue())))
            .andExpect(jsonPath("$.[*].langOption").value(hasItem(DEFAULT_LANG_OPTION.toString())));
    }

    @Test
    @Transactional
    void getLanguages() throws Exception {
        // Initialize the database
        languagesRepository.saveAndFlush(languages);

        // Get the languages
        restLanguagesMockMvc
            .perform(get(ENTITY_API_URL_ID, languages.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(languages.getId().intValue()))
            .andExpect(jsonPath("$.langOption").value(DEFAULT_LANG_OPTION.toString()));
    }

    @Test
    @Transactional
    void getNonExistingLanguages() throws Exception {
        // Get the languages
        restLanguagesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewLanguages() throws Exception {
        // Initialize the database
        languagesRepository.saveAndFlush(languages);

        int databaseSizeBeforeUpdate = languagesRepository.findAll().size();

        // Update the languages
        Languages updatedLanguages = languagesRepository.findById(languages.getId()).get();
        // Disconnect from session so that the updates on updatedLanguages are not directly saved in db
        em.detach(updatedLanguages);
        updatedLanguages.langOption(UPDATED_LANG_OPTION);

        restLanguagesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLanguages.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLanguages))
            )
            .andExpect(status().isOk());

        // Validate the Languages in the database
        List<Languages> languagesList = languagesRepository.findAll();
        assertThat(languagesList).hasSize(databaseSizeBeforeUpdate);
        Languages testLanguages = languagesList.get(languagesList.size() - 1);
        assertThat(testLanguages.getLangOption()).isEqualTo(UPDATED_LANG_OPTION);
    }

    @Test
    @Transactional
    void putNonExistingLanguages() throws Exception {
        int databaseSizeBeforeUpdate = languagesRepository.findAll().size();
        languages.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLanguagesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, languages.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(languages))
            )
            .andExpect(status().isBadRequest());

        // Validate the Languages in the database
        List<Languages> languagesList = languagesRepository.findAll();
        assertThat(languagesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLanguages() throws Exception {
        int databaseSizeBeforeUpdate = languagesRepository.findAll().size();
        languages.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLanguagesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(languages))
            )
            .andExpect(status().isBadRequest());

        // Validate the Languages in the database
        List<Languages> languagesList = languagesRepository.findAll();
        assertThat(languagesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLanguages() throws Exception {
        int databaseSizeBeforeUpdate = languagesRepository.findAll().size();
        languages.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLanguagesMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(languages)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Languages in the database
        List<Languages> languagesList = languagesRepository.findAll();
        assertThat(languagesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLanguagesWithPatch() throws Exception {
        // Initialize the database
        languagesRepository.saveAndFlush(languages);

        int databaseSizeBeforeUpdate = languagesRepository.findAll().size();

        // Update the languages using partial update
        Languages partialUpdatedLanguages = new Languages();
        partialUpdatedLanguages.setId(languages.getId());

        partialUpdatedLanguages.langOption(UPDATED_LANG_OPTION);

        restLanguagesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLanguages.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLanguages))
            )
            .andExpect(status().isOk());

        // Validate the Languages in the database
        List<Languages> languagesList = languagesRepository.findAll();
        assertThat(languagesList).hasSize(databaseSizeBeforeUpdate);
        Languages testLanguages = languagesList.get(languagesList.size() - 1);
        assertThat(testLanguages.getLangOption()).isEqualTo(UPDATED_LANG_OPTION);
    }

    @Test
    @Transactional
    void fullUpdateLanguagesWithPatch() throws Exception {
        // Initialize the database
        languagesRepository.saveAndFlush(languages);

        int databaseSizeBeforeUpdate = languagesRepository.findAll().size();

        // Update the languages using partial update
        Languages partialUpdatedLanguages = new Languages();
        partialUpdatedLanguages.setId(languages.getId());

        partialUpdatedLanguages.langOption(UPDATED_LANG_OPTION);

        restLanguagesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLanguages.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLanguages))
            )
            .andExpect(status().isOk());

        // Validate the Languages in the database
        List<Languages> languagesList = languagesRepository.findAll();
        assertThat(languagesList).hasSize(databaseSizeBeforeUpdate);
        Languages testLanguages = languagesList.get(languagesList.size() - 1);
        assertThat(testLanguages.getLangOption()).isEqualTo(UPDATED_LANG_OPTION);
    }

    @Test
    @Transactional
    void patchNonExistingLanguages() throws Exception {
        int databaseSizeBeforeUpdate = languagesRepository.findAll().size();
        languages.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLanguagesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, languages.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(languages))
            )
            .andExpect(status().isBadRequest());

        // Validate the Languages in the database
        List<Languages> languagesList = languagesRepository.findAll();
        assertThat(languagesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLanguages() throws Exception {
        int databaseSizeBeforeUpdate = languagesRepository.findAll().size();
        languages.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLanguagesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(languages))
            )
            .andExpect(status().isBadRequest());

        // Validate the Languages in the database
        List<Languages> languagesList = languagesRepository.findAll();
        assertThat(languagesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLanguages() throws Exception {
        int databaseSizeBeforeUpdate = languagesRepository.findAll().size();
        languages.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLanguagesMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(languages))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Languages in the database
        List<Languages> languagesList = languagesRepository.findAll();
        assertThat(languagesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLanguages() throws Exception {
        // Initialize the database
        languagesRepository.saveAndFlush(languages);

        int databaseSizeBeforeDelete = languagesRepository.findAll().size();

        // Delete the languages
        restLanguagesMockMvc
            .perform(delete(ENTITY_API_URL_ID, languages.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Languages> languagesList = languagesRepository.findAll();
        assertThat(languagesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
