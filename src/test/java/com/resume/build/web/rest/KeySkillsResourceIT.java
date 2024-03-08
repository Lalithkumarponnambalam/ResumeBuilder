package com.resume.build.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.resume.build.IntegrationTest;
import com.resume.build.domain.KeySkills;
import com.resume.build.repository.KeySkillsRepository;
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
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link KeySkillsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class KeySkillsResourceIT {

    private static final String DEFAULT_KEY_SKILLS_SUMMARY = "AAAAAAAAAA";
    private static final String UPDATED_KEY_SKILLS_SUMMARY = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/key-skills";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private KeySkillsRepository keySkillsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restKeySkillsMockMvc;

    private KeySkills keySkills;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static KeySkills createEntity(EntityManager em) {
        KeySkills keySkills = new KeySkills().keySkillsSummary(DEFAULT_KEY_SKILLS_SUMMARY);
        return keySkills;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static KeySkills createUpdatedEntity(EntityManager em) {
        KeySkills keySkills = new KeySkills().keySkillsSummary(UPDATED_KEY_SKILLS_SUMMARY);
        return keySkills;
    }

    @BeforeEach
    public void initTest() {
        keySkills = createEntity(em);
    }

    @Test
    @Transactional
    void createKeySkills() throws Exception {
        int databaseSizeBeforeCreate = keySkillsRepository.findAll().size();
        // Create the KeySkills
        restKeySkillsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(keySkills)))
            .andExpect(status().isCreated());

        // Validate the KeySkills in the database
        List<KeySkills> keySkillsList = keySkillsRepository.findAll();
        assertThat(keySkillsList).hasSize(databaseSizeBeforeCreate + 1);
        KeySkills testKeySkills = keySkillsList.get(keySkillsList.size() - 1);
        assertThat(testKeySkills.getKeySkillsSummary()).isEqualTo(DEFAULT_KEY_SKILLS_SUMMARY);
    }

    @Test
    @Transactional
    void createKeySkillsWithExistingId() throws Exception {
        // Create the KeySkills with an existing ID
        keySkills.setId(1L);

        int databaseSizeBeforeCreate = keySkillsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restKeySkillsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(keySkills)))
            .andExpect(status().isBadRequest());

        // Validate the KeySkills in the database
        List<KeySkills> keySkillsList = keySkillsRepository.findAll();
        assertThat(keySkillsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllKeySkills() throws Exception {
        // Initialize the database
        keySkillsRepository.saveAndFlush(keySkills);

        // Get all the keySkillsList
        restKeySkillsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(keySkills.getId().intValue())))
            .andExpect(jsonPath("$.[*].keySkillsSummary").value(hasItem(DEFAULT_KEY_SKILLS_SUMMARY.toString())));
    }

    @Test
    @Transactional
    void getKeySkills() throws Exception {
        // Initialize the database
        keySkillsRepository.saveAndFlush(keySkills);

        // Get the keySkills
        restKeySkillsMockMvc
            .perform(get(ENTITY_API_URL_ID, keySkills.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(keySkills.getId().intValue()))
            .andExpect(jsonPath("$.keySkillsSummary").value(DEFAULT_KEY_SKILLS_SUMMARY.toString()));
    }

    @Test
    @Transactional
    void getNonExistingKeySkills() throws Exception {
        // Get the keySkills
        restKeySkillsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewKeySkills() throws Exception {
        // Initialize the database
        keySkillsRepository.saveAndFlush(keySkills);

        int databaseSizeBeforeUpdate = keySkillsRepository.findAll().size();

        // Update the keySkills
        KeySkills updatedKeySkills = keySkillsRepository.findById(keySkills.getId()).get();
        // Disconnect from session so that the updates on updatedKeySkills are not directly saved in db
        em.detach(updatedKeySkills);
        updatedKeySkills.keySkillsSummary(UPDATED_KEY_SKILLS_SUMMARY);

        restKeySkillsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedKeySkills.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedKeySkills))
            )
            .andExpect(status().isOk());

        // Validate the KeySkills in the database
        List<KeySkills> keySkillsList = keySkillsRepository.findAll();
        assertThat(keySkillsList).hasSize(databaseSizeBeforeUpdate);
        KeySkills testKeySkills = keySkillsList.get(keySkillsList.size() - 1);
        assertThat(testKeySkills.getKeySkillsSummary()).isEqualTo(UPDATED_KEY_SKILLS_SUMMARY);
    }

    @Test
    @Transactional
    void putNonExistingKeySkills() throws Exception {
        int databaseSizeBeforeUpdate = keySkillsRepository.findAll().size();
        keySkills.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restKeySkillsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, keySkills.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(keySkills))
            )
            .andExpect(status().isBadRequest());

        // Validate the KeySkills in the database
        List<KeySkills> keySkillsList = keySkillsRepository.findAll();
        assertThat(keySkillsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchKeySkills() throws Exception {
        int databaseSizeBeforeUpdate = keySkillsRepository.findAll().size();
        keySkills.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKeySkillsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(keySkills))
            )
            .andExpect(status().isBadRequest());

        // Validate the KeySkills in the database
        List<KeySkills> keySkillsList = keySkillsRepository.findAll();
        assertThat(keySkillsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamKeySkills() throws Exception {
        int databaseSizeBeforeUpdate = keySkillsRepository.findAll().size();
        keySkills.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKeySkillsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(keySkills)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the KeySkills in the database
        List<KeySkills> keySkillsList = keySkillsRepository.findAll();
        assertThat(keySkillsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateKeySkillsWithPatch() throws Exception {
        // Initialize the database
        keySkillsRepository.saveAndFlush(keySkills);

        int databaseSizeBeforeUpdate = keySkillsRepository.findAll().size();

        // Update the keySkills using partial update
        KeySkills partialUpdatedKeySkills = new KeySkills();
        partialUpdatedKeySkills.setId(keySkills.getId());

        restKeySkillsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedKeySkills.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedKeySkills))
            )
            .andExpect(status().isOk());

        // Validate the KeySkills in the database
        List<KeySkills> keySkillsList = keySkillsRepository.findAll();
        assertThat(keySkillsList).hasSize(databaseSizeBeforeUpdate);
        KeySkills testKeySkills = keySkillsList.get(keySkillsList.size() - 1);
        assertThat(testKeySkills.getKeySkillsSummary()).isEqualTo(DEFAULT_KEY_SKILLS_SUMMARY);
    }

    @Test
    @Transactional
    void fullUpdateKeySkillsWithPatch() throws Exception {
        // Initialize the database
        keySkillsRepository.saveAndFlush(keySkills);

        int databaseSizeBeforeUpdate = keySkillsRepository.findAll().size();

        // Update the keySkills using partial update
        KeySkills partialUpdatedKeySkills = new KeySkills();
        partialUpdatedKeySkills.setId(keySkills.getId());

        partialUpdatedKeySkills.keySkillsSummary(UPDATED_KEY_SKILLS_SUMMARY);

        restKeySkillsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedKeySkills.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedKeySkills))
            )
            .andExpect(status().isOk());

        // Validate the KeySkills in the database
        List<KeySkills> keySkillsList = keySkillsRepository.findAll();
        assertThat(keySkillsList).hasSize(databaseSizeBeforeUpdate);
        KeySkills testKeySkills = keySkillsList.get(keySkillsList.size() - 1);
        assertThat(testKeySkills.getKeySkillsSummary()).isEqualTo(UPDATED_KEY_SKILLS_SUMMARY);
    }

    @Test
    @Transactional
    void patchNonExistingKeySkills() throws Exception {
        int databaseSizeBeforeUpdate = keySkillsRepository.findAll().size();
        keySkills.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restKeySkillsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, keySkills.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(keySkills))
            )
            .andExpect(status().isBadRequest());

        // Validate the KeySkills in the database
        List<KeySkills> keySkillsList = keySkillsRepository.findAll();
        assertThat(keySkillsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchKeySkills() throws Exception {
        int databaseSizeBeforeUpdate = keySkillsRepository.findAll().size();
        keySkills.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKeySkillsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(keySkills))
            )
            .andExpect(status().isBadRequest());

        // Validate the KeySkills in the database
        List<KeySkills> keySkillsList = keySkillsRepository.findAll();
        assertThat(keySkillsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamKeySkills() throws Exception {
        int databaseSizeBeforeUpdate = keySkillsRepository.findAll().size();
        keySkills.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restKeySkillsMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(keySkills))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the KeySkills in the database
        List<KeySkills> keySkillsList = keySkillsRepository.findAll();
        assertThat(keySkillsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteKeySkills() throws Exception {
        // Initialize the database
        keySkillsRepository.saveAndFlush(keySkills);

        int databaseSizeBeforeDelete = keySkillsRepository.findAll().size();

        // Delete the keySkills
        restKeySkillsMockMvc
            .perform(delete(ENTITY_API_URL_ID, keySkills.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<KeySkills> keySkillsList = keySkillsRepository.findAll();
        assertThat(keySkillsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
