package com.resume.build.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.resume.build.IntegrationTest;
import com.resume.build.domain.ExperienceDetails;
import com.resume.build.repository.ExperienceDetailsRepository;
import java.time.LocalDate;
import java.time.ZoneId;
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
 * Integration tests for the {@link ExperienceDetailsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ExperienceDetailsResourceIT {

    private static final String DEFAULT_POSITION_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_POSITION_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_COMPANY_NAME = "AAAAAAAAAA";
    private static final String UPDATED_COMPANY_NAME = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_START_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_START_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_END_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_END_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_WORK_SUMMARY = "AAAAAAAAAA";
    private static final String UPDATED_WORK_SUMMARY = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/experience-details";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ExperienceDetailsRepository experienceDetailsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restExperienceDetailsMockMvc;

    private ExperienceDetails experienceDetails;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ExperienceDetails createEntity(EntityManager em) {
        ExperienceDetails experienceDetails = new ExperienceDetails()
            .positionTitle(DEFAULT_POSITION_TITLE)
            .companyName(DEFAULT_COMPANY_NAME)
            .startDate(DEFAULT_START_DATE)
            .endDate(DEFAULT_END_DATE)
            .workSummary(DEFAULT_WORK_SUMMARY);
        return experienceDetails;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ExperienceDetails createUpdatedEntity(EntityManager em) {
        ExperienceDetails experienceDetails = new ExperienceDetails()
            .positionTitle(UPDATED_POSITION_TITLE)
            .companyName(UPDATED_COMPANY_NAME)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .workSummary(UPDATED_WORK_SUMMARY);
        return experienceDetails;
    }

    @BeforeEach
    public void initTest() {
        experienceDetails = createEntity(em);
    }

    @Test
    @Transactional
    void createExperienceDetails() throws Exception {
        int databaseSizeBeforeCreate = experienceDetailsRepository.findAll().size();
        // Create the ExperienceDetails
        restExperienceDetailsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(experienceDetails))
            )
            .andExpect(status().isCreated());

        // Validate the ExperienceDetails in the database
        List<ExperienceDetails> experienceDetailsList = experienceDetailsRepository.findAll();
        assertThat(experienceDetailsList).hasSize(databaseSizeBeforeCreate + 1);
        ExperienceDetails testExperienceDetails = experienceDetailsList.get(experienceDetailsList.size() - 1);
        assertThat(testExperienceDetails.getPositionTitle()).isEqualTo(DEFAULT_POSITION_TITLE);
        assertThat(testExperienceDetails.getCompanyName()).isEqualTo(DEFAULT_COMPANY_NAME);
        assertThat(testExperienceDetails.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testExperienceDetails.getEndDate()).isEqualTo(DEFAULT_END_DATE);
        assertThat(testExperienceDetails.getWorkSummary()).isEqualTo(DEFAULT_WORK_SUMMARY);
    }

    @Test
    @Transactional
    void createExperienceDetailsWithExistingId() throws Exception {
        // Create the ExperienceDetails with an existing ID
        experienceDetails.setId(1L);

        int databaseSizeBeforeCreate = experienceDetailsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restExperienceDetailsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(experienceDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExperienceDetails in the database
        List<ExperienceDetails> experienceDetailsList = experienceDetailsRepository.findAll();
        assertThat(experienceDetailsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllExperienceDetails() throws Exception {
        // Initialize the database
        experienceDetailsRepository.saveAndFlush(experienceDetails);

        // Get all the experienceDetailsList
        restExperienceDetailsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(experienceDetails.getId().intValue())))
            .andExpect(jsonPath("$.[*].positionTitle").value(hasItem(DEFAULT_POSITION_TITLE)))
            .andExpect(jsonPath("$.[*].companyName").value(hasItem(DEFAULT_COMPANY_NAME)))
            .andExpect(jsonPath("$.[*].startDate").value(hasItem(DEFAULT_START_DATE.toString())))
            .andExpect(jsonPath("$.[*].endDate").value(hasItem(DEFAULT_END_DATE.toString())))
            .andExpect(jsonPath("$.[*].workSummary").value(hasItem(DEFAULT_WORK_SUMMARY.toString())));
    }

    @Test
    @Transactional
    void getExperienceDetails() throws Exception {
        // Initialize the database
        experienceDetailsRepository.saveAndFlush(experienceDetails);

        // Get the experienceDetails
        restExperienceDetailsMockMvc
            .perform(get(ENTITY_API_URL_ID, experienceDetails.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(experienceDetails.getId().intValue()))
            .andExpect(jsonPath("$.positionTitle").value(DEFAULT_POSITION_TITLE))
            .andExpect(jsonPath("$.companyName").value(DEFAULT_COMPANY_NAME))
            .andExpect(jsonPath("$.startDate").value(DEFAULT_START_DATE.toString()))
            .andExpect(jsonPath("$.endDate").value(DEFAULT_END_DATE.toString()))
            .andExpect(jsonPath("$.workSummary").value(DEFAULT_WORK_SUMMARY.toString()));
    }

    @Test
    @Transactional
    void getNonExistingExperienceDetails() throws Exception {
        // Get the experienceDetails
        restExperienceDetailsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewExperienceDetails() throws Exception {
        // Initialize the database
        experienceDetailsRepository.saveAndFlush(experienceDetails);

        int databaseSizeBeforeUpdate = experienceDetailsRepository.findAll().size();

        // Update the experienceDetails
        ExperienceDetails updatedExperienceDetails = experienceDetailsRepository.findById(experienceDetails.getId()).get();
        // Disconnect from session so that the updates on updatedExperienceDetails are not directly saved in db
        em.detach(updatedExperienceDetails);
        updatedExperienceDetails
            .positionTitle(UPDATED_POSITION_TITLE)
            .companyName(UPDATED_COMPANY_NAME)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .workSummary(UPDATED_WORK_SUMMARY);

        restExperienceDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedExperienceDetails.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedExperienceDetails))
            )
            .andExpect(status().isOk());

        // Validate the ExperienceDetails in the database
        List<ExperienceDetails> experienceDetailsList = experienceDetailsRepository.findAll();
        assertThat(experienceDetailsList).hasSize(databaseSizeBeforeUpdate);
        ExperienceDetails testExperienceDetails = experienceDetailsList.get(experienceDetailsList.size() - 1);
        assertThat(testExperienceDetails.getPositionTitle()).isEqualTo(UPDATED_POSITION_TITLE);
        assertThat(testExperienceDetails.getCompanyName()).isEqualTo(UPDATED_COMPANY_NAME);
        assertThat(testExperienceDetails.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testExperienceDetails.getEndDate()).isEqualTo(UPDATED_END_DATE);
        assertThat(testExperienceDetails.getWorkSummary()).isEqualTo(UPDATED_WORK_SUMMARY);
    }

    @Test
    @Transactional
    void putNonExistingExperienceDetails() throws Exception {
        int databaseSizeBeforeUpdate = experienceDetailsRepository.findAll().size();
        experienceDetails.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restExperienceDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, experienceDetails.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(experienceDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExperienceDetails in the database
        List<ExperienceDetails> experienceDetailsList = experienceDetailsRepository.findAll();
        assertThat(experienceDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchExperienceDetails() throws Exception {
        int databaseSizeBeforeUpdate = experienceDetailsRepository.findAll().size();
        experienceDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExperienceDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(experienceDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExperienceDetails in the database
        List<ExperienceDetails> experienceDetailsList = experienceDetailsRepository.findAll();
        assertThat(experienceDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamExperienceDetails() throws Exception {
        int databaseSizeBeforeUpdate = experienceDetailsRepository.findAll().size();
        experienceDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExperienceDetailsMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(experienceDetails))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ExperienceDetails in the database
        List<ExperienceDetails> experienceDetailsList = experienceDetailsRepository.findAll();
        assertThat(experienceDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateExperienceDetailsWithPatch() throws Exception {
        // Initialize the database
        experienceDetailsRepository.saveAndFlush(experienceDetails);

        int databaseSizeBeforeUpdate = experienceDetailsRepository.findAll().size();

        // Update the experienceDetails using partial update
        ExperienceDetails partialUpdatedExperienceDetails = new ExperienceDetails();
        partialUpdatedExperienceDetails.setId(experienceDetails.getId());

        partialUpdatedExperienceDetails.companyName(UPDATED_COMPANY_NAME).endDate(UPDATED_END_DATE);

        restExperienceDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedExperienceDetails.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedExperienceDetails))
            )
            .andExpect(status().isOk());

        // Validate the ExperienceDetails in the database
        List<ExperienceDetails> experienceDetailsList = experienceDetailsRepository.findAll();
        assertThat(experienceDetailsList).hasSize(databaseSizeBeforeUpdate);
        ExperienceDetails testExperienceDetails = experienceDetailsList.get(experienceDetailsList.size() - 1);
        assertThat(testExperienceDetails.getPositionTitle()).isEqualTo(DEFAULT_POSITION_TITLE);
        assertThat(testExperienceDetails.getCompanyName()).isEqualTo(UPDATED_COMPANY_NAME);
        assertThat(testExperienceDetails.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testExperienceDetails.getEndDate()).isEqualTo(UPDATED_END_DATE);
        assertThat(testExperienceDetails.getWorkSummary()).isEqualTo(DEFAULT_WORK_SUMMARY);
    }

    @Test
    @Transactional
    void fullUpdateExperienceDetailsWithPatch() throws Exception {
        // Initialize the database
        experienceDetailsRepository.saveAndFlush(experienceDetails);

        int databaseSizeBeforeUpdate = experienceDetailsRepository.findAll().size();

        // Update the experienceDetails using partial update
        ExperienceDetails partialUpdatedExperienceDetails = new ExperienceDetails();
        partialUpdatedExperienceDetails.setId(experienceDetails.getId());

        partialUpdatedExperienceDetails
            .positionTitle(UPDATED_POSITION_TITLE)
            .companyName(UPDATED_COMPANY_NAME)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .workSummary(UPDATED_WORK_SUMMARY);

        restExperienceDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedExperienceDetails.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedExperienceDetails))
            )
            .andExpect(status().isOk());

        // Validate the ExperienceDetails in the database
        List<ExperienceDetails> experienceDetailsList = experienceDetailsRepository.findAll();
        assertThat(experienceDetailsList).hasSize(databaseSizeBeforeUpdate);
        ExperienceDetails testExperienceDetails = experienceDetailsList.get(experienceDetailsList.size() - 1);
        assertThat(testExperienceDetails.getPositionTitle()).isEqualTo(UPDATED_POSITION_TITLE);
        assertThat(testExperienceDetails.getCompanyName()).isEqualTo(UPDATED_COMPANY_NAME);
        assertThat(testExperienceDetails.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testExperienceDetails.getEndDate()).isEqualTo(UPDATED_END_DATE);
        assertThat(testExperienceDetails.getWorkSummary()).isEqualTo(UPDATED_WORK_SUMMARY);
    }

    @Test
    @Transactional
    void patchNonExistingExperienceDetails() throws Exception {
        int databaseSizeBeforeUpdate = experienceDetailsRepository.findAll().size();
        experienceDetails.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restExperienceDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, experienceDetails.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(experienceDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExperienceDetails in the database
        List<ExperienceDetails> experienceDetailsList = experienceDetailsRepository.findAll();
        assertThat(experienceDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchExperienceDetails() throws Exception {
        int databaseSizeBeforeUpdate = experienceDetailsRepository.findAll().size();
        experienceDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExperienceDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(experienceDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExperienceDetails in the database
        List<ExperienceDetails> experienceDetailsList = experienceDetailsRepository.findAll();
        assertThat(experienceDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamExperienceDetails() throws Exception {
        int databaseSizeBeforeUpdate = experienceDetailsRepository.findAll().size();
        experienceDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExperienceDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(experienceDetails))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ExperienceDetails in the database
        List<ExperienceDetails> experienceDetailsList = experienceDetailsRepository.findAll();
        assertThat(experienceDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteExperienceDetails() throws Exception {
        // Initialize the database
        experienceDetailsRepository.saveAndFlush(experienceDetails);

        int databaseSizeBeforeDelete = experienceDetailsRepository.findAll().size();

        // Delete the experienceDetails
        restExperienceDetailsMockMvc
            .perform(delete(ENTITY_API_URL_ID, experienceDetails.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ExperienceDetails> experienceDetailsList = experienceDetailsRepository.findAll();
        assertThat(experienceDetailsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
