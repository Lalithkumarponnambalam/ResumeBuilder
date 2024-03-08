package com.resume.build.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.resume.build.IntegrationTest;
import com.resume.build.domain.AreaofInterest;
import com.resume.build.repository.AreaofInterestRepository;
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
 * Integration tests for the {@link AreaofInterestResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AreaofInterestResourceIT {

    private static final String DEFAULT_INTREST_SUMMARY = "AAAAAAAAAA";
    private static final String UPDATED_INTREST_SUMMARY = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/areaof-interests";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AreaofInterestRepository areaofInterestRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAreaofInterestMockMvc;

    private AreaofInterest areaofInterest;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AreaofInterest createEntity(EntityManager em) {
        AreaofInterest areaofInterest = new AreaofInterest().intrestSummary(DEFAULT_INTREST_SUMMARY);
        return areaofInterest;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AreaofInterest createUpdatedEntity(EntityManager em) {
        AreaofInterest areaofInterest = new AreaofInterest().intrestSummary(UPDATED_INTREST_SUMMARY);
        return areaofInterest;
    }

    @BeforeEach
    public void initTest() {
        areaofInterest = createEntity(em);
    }

    @Test
    @Transactional
    void createAreaofInterest() throws Exception {
        int databaseSizeBeforeCreate = areaofInterestRepository.findAll().size();
        // Create the AreaofInterest
        restAreaofInterestMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(areaofInterest))
            )
            .andExpect(status().isCreated());

        // Validate the AreaofInterest in the database
        List<AreaofInterest> areaofInterestList = areaofInterestRepository.findAll();
        assertThat(areaofInterestList).hasSize(databaseSizeBeforeCreate + 1);
        AreaofInterest testAreaofInterest = areaofInterestList.get(areaofInterestList.size() - 1);
        assertThat(testAreaofInterest.getIntrestSummary()).isEqualTo(DEFAULT_INTREST_SUMMARY);
    }

    @Test
    @Transactional
    void createAreaofInterestWithExistingId() throws Exception {
        // Create the AreaofInterest with an existing ID
        areaofInterest.setId(1L);

        int databaseSizeBeforeCreate = areaofInterestRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAreaofInterestMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(areaofInterest))
            )
            .andExpect(status().isBadRequest());

        // Validate the AreaofInterest in the database
        List<AreaofInterest> areaofInterestList = areaofInterestRepository.findAll();
        assertThat(areaofInterestList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAreaofInterests() throws Exception {
        // Initialize the database
        areaofInterestRepository.saveAndFlush(areaofInterest);

        // Get all the areaofInterestList
        restAreaofInterestMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(areaofInterest.getId().intValue())))
            .andExpect(jsonPath("$.[*].intrestSummary").value(hasItem(DEFAULT_INTREST_SUMMARY.toString())));
    }

    @Test
    @Transactional
    void getAreaofInterest() throws Exception {
        // Initialize the database
        areaofInterestRepository.saveAndFlush(areaofInterest);

        // Get the areaofInterest
        restAreaofInterestMockMvc
            .perform(get(ENTITY_API_URL_ID, areaofInterest.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(areaofInterest.getId().intValue()))
            .andExpect(jsonPath("$.intrestSummary").value(DEFAULT_INTREST_SUMMARY.toString()));
    }

    @Test
    @Transactional
    void getNonExistingAreaofInterest() throws Exception {
        // Get the areaofInterest
        restAreaofInterestMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAreaofInterest() throws Exception {
        // Initialize the database
        areaofInterestRepository.saveAndFlush(areaofInterest);

        int databaseSizeBeforeUpdate = areaofInterestRepository.findAll().size();

        // Update the areaofInterest
        AreaofInterest updatedAreaofInterest = areaofInterestRepository.findById(areaofInterest.getId()).get();
        // Disconnect from session so that the updates on updatedAreaofInterest are not directly saved in db
        em.detach(updatedAreaofInterest);
        updatedAreaofInterest.intrestSummary(UPDATED_INTREST_SUMMARY);

        restAreaofInterestMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAreaofInterest.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAreaofInterest))
            )
            .andExpect(status().isOk());

        // Validate the AreaofInterest in the database
        List<AreaofInterest> areaofInterestList = areaofInterestRepository.findAll();
        assertThat(areaofInterestList).hasSize(databaseSizeBeforeUpdate);
        AreaofInterest testAreaofInterest = areaofInterestList.get(areaofInterestList.size() - 1);
        assertThat(testAreaofInterest.getIntrestSummary()).isEqualTo(UPDATED_INTREST_SUMMARY);
    }

    @Test
    @Transactional
    void putNonExistingAreaofInterest() throws Exception {
        int databaseSizeBeforeUpdate = areaofInterestRepository.findAll().size();
        areaofInterest.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAreaofInterestMockMvc
            .perform(
                put(ENTITY_API_URL_ID, areaofInterest.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(areaofInterest))
            )
            .andExpect(status().isBadRequest());

        // Validate the AreaofInterest in the database
        List<AreaofInterest> areaofInterestList = areaofInterestRepository.findAll();
        assertThat(areaofInterestList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAreaofInterest() throws Exception {
        int databaseSizeBeforeUpdate = areaofInterestRepository.findAll().size();
        areaofInterest.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAreaofInterestMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(areaofInterest))
            )
            .andExpect(status().isBadRequest());

        // Validate the AreaofInterest in the database
        List<AreaofInterest> areaofInterestList = areaofInterestRepository.findAll();
        assertThat(areaofInterestList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAreaofInterest() throws Exception {
        int databaseSizeBeforeUpdate = areaofInterestRepository.findAll().size();
        areaofInterest.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAreaofInterestMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(areaofInterest)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AreaofInterest in the database
        List<AreaofInterest> areaofInterestList = areaofInterestRepository.findAll();
        assertThat(areaofInterestList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAreaofInterestWithPatch() throws Exception {
        // Initialize the database
        areaofInterestRepository.saveAndFlush(areaofInterest);

        int databaseSizeBeforeUpdate = areaofInterestRepository.findAll().size();

        // Update the areaofInterest using partial update
        AreaofInterest partialUpdatedAreaofInterest = new AreaofInterest();
        partialUpdatedAreaofInterest.setId(areaofInterest.getId());

        partialUpdatedAreaofInterest.intrestSummary(UPDATED_INTREST_SUMMARY);

        restAreaofInterestMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAreaofInterest.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAreaofInterest))
            )
            .andExpect(status().isOk());

        // Validate the AreaofInterest in the database
        List<AreaofInterest> areaofInterestList = areaofInterestRepository.findAll();
        assertThat(areaofInterestList).hasSize(databaseSizeBeforeUpdate);
        AreaofInterest testAreaofInterest = areaofInterestList.get(areaofInterestList.size() - 1);
        assertThat(testAreaofInterest.getIntrestSummary()).isEqualTo(UPDATED_INTREST_SUMMARY);
    }

    @Test
    @Transactional
    void fullUpdateAreaofInterestWithPatch() throws Exception {
        // Initialize the database
        areaofInterestRepository.saveAndFlush(areaofInterest);

        int databaseSizeBeforeUpdate = areaofInterestRepository.findAll().size();

        // Update the areaofInterest using partial update
        AreaofInterest partialUpdatedAreaofInterest = new AreaofInterest();
        partialUpdatedAreaofInterest.setId(areaofInterest.getId());

        partialUpdatedAreaofInterest.intrestSummary(UPDATED_INTREST_SUMMARY);

        restAreaofInterestMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAreaofInterest.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAreaofInterest))
            )
            .andExpect(status().isOk());

        // Validate the AreaofInterest in the database
        List<AreaofInterest> areaofInterestList = areaofInterestRepository.findAll();
        assertThat(areaofInterestList).hasSize(databaseSizeBeforeUpdate);
        AreaofInterest testAreaofInterest = areaofInterestList.get(areaofInterestList.size() - 1);
        assertThat(testAreaofInterest.getIntrestSummary()).isEqualTo(UPDATED_INTREST_SUMMARY);
    }

    @Test
    @Transactional
    void patchNonExistingAreaofInterest() throws Exception {
        int databaseSizeBeforeUpdate = areaofInterestRepository.findAll().size();
        areaofInterest.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAreaofInterestMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, areaofInterest.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(areaofInterest))
            )
            .andExpect(status().isBadRequest());

        // Validate the AreaofInterest in the database
        List<AreaofInterest> areaofInterestList = areaofInterestRepository.findAll();
        assertThat(areaofInterestList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAreaofInterest() throws Exception {
        int databaseSizeBeforeUpdate = areaofInterestRepository.findAll().size();
        areaofInterest.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAreaofInterestMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(areaofInterest))
            )
            .andExpect(status().isBadRequest());

        // Validate the AreaofInterest in the database
        List<AreaofInterest> areaofInterestList = areaofInterestRepository.findAll();
        assertThat(areaofInterestList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAreaofInterest() throws Exception {
        int databaseSizeBeforeUpdate = areaofInterestRepository.findAll().size();
        areaofInterest.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAreaofInterestMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(areaofInterest))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AreaofInterest in the database
        List<AreaofInterest> areaofInterestList = areaofInterestRepository.findAll();
        assertThat(areaofInterestList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAreaofInterest() throws Exception {
        // Initialize the database
        areaofInterestRepository.saveAndFlush(areaofInterest);

        int databaseSizeBeforeDelete = areaofInterestRepository.findAll().size();

        // Delete the areaofInterest
        restAreaofInterestMockMvc
            .perform(delete(ENTITY_API_URL_ID, areaofInterest.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<AreaofInterest> areaofInterestList = areaofInterestRepository.findAll();
        assertThat(areaofInterestList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
