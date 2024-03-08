package com.resume.build.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.resume.build.IntegrationTest;
import com.resume.build.domain.WorkDetails;
import com.resume.build.repository.WorkDetailsRepository;
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
 * Integration tests for the {@link WorkDetailsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class WorkDetailsResourceIT {

    private static final String DEFAULT_JOB_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_JOB_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_POSITION = "AAAAAAAAAA";
    private static final String UPDATED_POSITION = "BBBBBBBBBB";

    private static final String DEFAULT_COMPANY_NAME = "AAAAAAAAAA";
    private static final String UPDATED_COMPANY_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_CITY = "AAAAAAAAAA";
    private static final String UPDATED_CITY = "BBBBBBBBBB";

    private static final String DEFAULT_STATE = "AAAAAAAAAA";
    private static final String UPDATED_STATE = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_START_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_START_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_END_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_END_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_WORK_SUMMARY = "AAAAAAAAAA";
    private static final String UPDATED_WORK_SUMMARY = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/work-details";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private WorkDetailsRepository workDetailsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restWorkDetailsMockMvc;

    private WorkDetails workDetails;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static WorkDetails createEntity(EntityManager em) {
        WorkDetails workDetails = new WorkDetails()
            .jobTitle(DEFAULT_JOB_TITLE)
            .position(DEFAULT_POSITION)
            .companyName(DEFAULT_COMPANY_NAME)
            .city(DEFAULT_CITY)
            .state(DEFAULT_STATE)
            .startDate(DEFAULT_START_DATE)
            .endDate(DEFAULT_END_DATE)
            .workSummary(DEFAULT_WORK_SUMMARY);
        return workDetails;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static WorkDetails createUpdatedEntity(EntityManager em) {
        WorkDetails workDetails = new WorkDetails()
            .jobTitle(UPDATED_JOB_TITLE)
            .position(UPDATED_POSITION)
            .companyName(UPDATED_COMPANY_NAME)
            .city(UPDATED_CITY)
            .state(UPDATED_STATE)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .workSummary(UPDATED_WORK_SUMMARY);
        return workDetails;
    }

    @BeforeEach
    public void initTest() {
        workDetails = createEntity(em);
    }

    @Test
    @Transactional
    void createWorkDetails() throws Exception {
        int databaseSizeBeforeCreate = workDetailsRepository.findAll().size();
        // Create the WorkDetails
        restWorkDetailsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(workDetails)))
            .andExpect(status().isCreated());

        // Validate the WorkDetails in the database
        List<WorkDetails> workDetailsList = workDetailsRepository.findAll();
        assertThat(workDetailsList).hasSize(databaseSizeBeforeCreate + 1);
        WorkDetails testWorkDetails = workDetailsList.get(workDetailsList.size() - 1);
        assertThat(testWorkDetails.getJobTitle()).isEqualTo(DEFAULT_JOB_TITLE);
        assertThat(testWorkDetails.getPosition()).isEqualTo(DEFAULT_POSITION);
        assertThat(testWorkDetails.getCompanyName()).isEqualTo(DEFAULT_COMPANY_NAME);
        assertThat(testWorkDetails.getCity()).isEqualTo(DEFAULT_CITY);
        assertThat(testWorkDetails.getState()).isEqualTo(DEFAULT_STATE);
        assertThat(testWorkDetails.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testWorkDetails.getEndDate()).isEqualTo(DEFAULT_END_DATE);
        assertThat(testWorkDetails.getWorkSummary()).isEqualTo(DEFAULT_WORK_SUMMARY);
    }

    @Test
    @Transactional
    void createWorkDetailsWithExistingId() throws Exception {
        // Create the WorkDetails with an existing ID
        workDetails.setId(1L);

        int databaseSizeBeforeCreate = workDetailsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restWorkDetailsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(workDetails)))
            .andExpect(status().isBadRequest());

        // Validate the WorkDetails in the database
        List<WorkDetails> workDetailsList = workDetailsRepository.findAll();
        assertThat(workDetailsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkJobTitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = workDetailsRepository.findAll().size();
        // set the field null
        workDetails.setJobTitle(null);

        // Create the WorkDetails, which fails.

        restWorkDetailsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(workDetails)))
            .andExpect(status().isBadRequest());

        List<WorkDetails> workDetailsList = workDetailsRepository.findAll();
        assertThat(workDetailsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllWorkDetails() throws Exception {
        // Initialize the database
        workDetailsRepository.saveAndFlush(workDetails);

        // Get all the workDetailsList
        restWorkDetailsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(workDetails.getId().intValue())))
            .andExpect(jsonPath("$.[*].jobTitle").value(hasItem(DEFAULT_JOB_TITLE)))
            .andExpect(jsonPath("$.[*].position").value(hasItem(DEFAULT_POSITION)))
            .andExpect(jsonPath("$.[*].companyName").value(hasItem(DEFAULT_COMPANY_NAME)))
            .andExpect(jsonPath("$.[*].city").value(hasItem(DEFAULT_CITY)))
            .andExpect(jsonPath("$.[*].state").value(hasItem(DEFAULT_STATE)))
            .andExpect(jsonPath("$.[*].startDate").value(hasItem(DEFAULT_START_DATE.toString())))
            .andExpect(jsonPath("$.[*].endDate").value(hasItem(DEFAULT_END_DATE.toString())))
            .andExpect(jsonPath("$.[*].workSummary").value(hasItem(DEFAULT_WORK_SUMMARY.toString())));
    }

    @Test
    @Transactional
    void getWorkDetails() throws Exception {
        // Initialize the database
        workDetailsRepository.saveAndFlush(workDetails);

        // Get the workDetails
        restWorkDetailsMockMvc
            .perform(get(ENTITY_API_URL_ID, workDetails.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(workDetails.getId().intValue()))
            .andExpect(jsonPath("$.jobTitle").value(DEFAULT_JOB_TITLE))
            .andExpect(jsonPath("$.position").value(DEFAULT_POSITION))
            .andExpect(jsonPath("$.companyName").value(DEFAULT_COMPANY_NAME))
            .andExpect(jsonPath("$.city").value(DEFAULT_CITY))
            .andExpect(jsonPath("$.state").value(DEFAULT_STATE))
            .andExpect(jsonPath("$.startDate").value(DEFAULT_START_DATE.toString()))
            .andExpect(jsonPath("$.endDate").value(DEFAULT_END_DATE.toString()))
            .andExpect(jsonPath("$.workSummary").value(DEFAULT_WORK_SUMMARY.toString()));
    }

    @Test
    @Transactional
    void getNonExistingWorkDetails() throws Exception {
        // Get the workDetails
        restWorkDetailsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewWorkDetails() throws Exception {
        // Initialize the database
        workDetailsRepository.saveAndFlush(workDetails);

        int databaseSizeBeforeUpdate = workDetailsRepository.findAll().size();

        // Update the workDetails
        WorkDetails updatedWorkDetails = workDetailsRepository.findById(workDetails.getId()).get();
        // Disconnect from session so that the updates on updatedWorkDetails are not directly saved in db
        em.detach(updatedWorkDetails);
        updatedWorkDetails
            .jobTitle(UPDATED_JOB_TITLE)
            .position(UPDATED_POSITION)
            .companyName(UPDATED_COMPANY_NAME)
            .city(UPDATED_CITY)
            .state(UPDATED_STATE)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .workSummary(UPDATED_WORK_SUMMARY);

        restWorkDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedWorkDetails.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedWorkDetails))
            )
            .andExpect(status().isOk());

        // Validate the WorkDetails in the database
        List<WorkDetails> workDetailsList = workDetailsRepository.findAll();
        assertThat(workDetailsList).hasSize(databaseSizeBeforeUpdate);
        WorkDetails testWorkDetails = workDetailsList.get(workDetailsList.size() - 1);
        assertThat(testWorkDetails.getJobTitle()).isEqualTo(UPDATED_JOB_TITLE);
        assertThat(testWorkDetails.getPosition()).isEqualTo(UPDATED_POSITION);
        assertThat(testWorkDetails.getCompanyName()).isEqualTo(UPDATED_COMPANY_NAME);
        assertThat(testWorkDetails.getCity()).isEqualTo(UPDATED_CITY);
        assertThat(testWorkDetails.getState()).isEqualTo(UPDATED_STATE);
        assertThat(testWorkDetails.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testWorkDetails.getEndDate()).isEqualTo(UPDATED_END_DATE);
        assertThat(testWorkDetails.getWorkSummary()).isEqualTo(UPDATED_WORK_SUMMARY);
    }

    @Test
    @Transactional
    void putNonExistingWorkDetails() throws Exception {
        int databaseSizeBeforeUpdate = workDetailsRepository.findAll().size();
        workDetails.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restWorkDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, workDetails.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(workDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the WorkDetails in the database
        List<WorkDetails> workDetailsList = workDetailsRepository.findAll();
        assertThat(workDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchWorkDetails() throws Exception {
        int databaseSizeBeforeUpdate = workDetailsRepository.findAll().size();
        workDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWorkDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(workDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the WorkDetails in the database
        List<WorkDetails> workDetailsList = workDetailsRepository.findAll();
        assertThat(workDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamWorkDetails() throws Exception {
        int databaseSizeBeforeUpdate = workDetailsRepository.findAll().size();
        workDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWorkDetailsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(workDetails)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the WorkDetails in the database
        List<WorkDetails> workDetailsList = workDetailsRepository.findAll();
        assertThat(workDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateWorkDetailsWithPatch() throws Exception {
        // Initialize the database
        workDetailsRepository.saveAndFlush(workDetails);

        int databaseSizeBeforeUpdate = workDetailsRepository.findAll().size();

        // Update the workDetails using partial update
        WorkDetails partialUpdatedWorkDetails = new WorkDetails();
        partialUpdatedWorkDetails.setId(workDetails.getId());

        partialUpdatedWorkDetails.position(UPDATED_POSITION).companyName(UPDATED_COMPANY_NAME).endDate(UPDATED_END_DATE);

        restWorkDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedWorkDetails.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedWorkDetails))
            )
            .andExpect(status().isOk());

        // Validate the WorkDetails in the database
        List<WorkDetails> workDetailsList = workDetailsRepository.findAll();
        assertThat(workDetailsList).hasSize(databaseSizeBeforeUpdate);
        WorkDetails testWorkDetails = workDetailsList.get(workDetailsList.size() - 1);
        assertThat(testWorkDetails.getJobTitle()).isEqualTo(DEFAULT_JOB_TITLE);
        assertThat(testWorkDetails.getPosition()).isEqualTo(UPDATED_POSITION);
        assertThat(testWorkDetails.getCompanyName()).isEqualTo(UPDATED_COMPANY_NAME);
        assertThat(testWorkDetails.getCity()).isEqualTo(DEFAULT_CITY);
        assertThat(testWorkDetails.getState()).isEqualTo(DEFAULT_STATE);
        assertThat(testWorkDetails.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testWorkDetails.getEndDate()).isEqualTo(UPDATED_END_DATE);
        assertThat(testWorkDetails.getWorkSummary()).isEqualTo(DEFAULT_WORK_SUMMARY);
    }

    @Test
    @Transactional
    void fullUpdateWorkDetailsWithPatch() throws Exception {
        // Initialize the database
        workDetailsRepository.saveAndFlush(workDetails);

        int databaseSizeBeforeUpdate = workDetailsRepository.findAll().size();

        // Update the workDetails using partial update
        WorkDetails partialUpdatedWorkDetails = new WorkDetails();
        partialUpdatedWorkDetails.setId(workDetails.getId());

        partialUpdatedWorkDetails
            .jobTitle(UPDATED_JOB_TITLE)
            .position(UPDATED_POSITION)
            .companyName(UPDATED_COMPANY_NAME)
            .city(UPDATED_CITY)
            .state(UPDATED_STATE)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .workSummary(UPDATED_WORK_SUMMARY);

        restWorkDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedWorkDetails.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedWorkDetails))
            )
            .andExpect(status().isOk());

        // Validate the WorkDetails in the database
        List<WorkDetails> workDetailsList = workDetailsRepository.findAll();
        assertThat(workDetailsList).hasSize(databaseSizeBeforeUpdate);
        WorkDetails testWorkDetails = workDetailsList.get(workDetailsList.size() - 1);
        assertThat(testWorkDetails.getJobTitle()).isEqualTo(UPDATED_JOB_TITLE);
        assertThat(testWorkDetails.getPosition()).isEqualTo(UPDATED_POSITION);
        assertThat(testWorkDetails.getCompanyName()).isEqualTo(UPDATED_COMPANY_NAME);
        assertThat(testWorkDetails.getCity()).isEqualTo(UPDATED_CITY);
        assertThat(testWorkDetails.getState()).isEqualTo(UPDATED_STATE);
        assertThat(testWorkDetails.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testWorkDetails.getEndDate()).isEqualTo(UPDATED_END_DATE);
        assertThat(testWorkDetails.getWorkSummary()).isEqualTo(UPDATED_WORK_SUMMARY);
    }

    @Test
    @Transactional
    void patchNonExistingWorkDetails() throws Exception {
        int databaseSizeBeforeUpdate = workDetailsRepository.findAll().size();
        workDetails.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restWorkDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, workDetails.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(workDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the WorkDetails in the database
        List<WorkDetails> workDetailsList = workDetailsRepository.findAll();
        assertThat(workDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchWorkDetails() throws Exception {
        int databaseSizeBeforeUpdate = workDetailsRepository.findAll().size();
        workDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWorkDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(workDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the WorkDetails in the database
        List<WorkDetails> workDetailsList = workDetailsRepository.findAll();
        assertThat(workDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamWorkDetails() throws Exception {
        int databaseSizeBeforeUpdate = workDetailsRepository.findAll().size();
        workDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWorkDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(workDetails))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the WorkDetails in the database
        List<WorkDetails> workDetailsList = workDetailsRepository.findAll();
        assertThat(workDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteWorkDetails() throws Exception {
        // Initialize the database
        workDetailsRepository.saveAndFlush(workDetails);

        int databaseSizeBeforeDelete = workDetailsRepository.findAll().size();

        // Delete the workDetails
        restWorkDetailsMockMvc
            .perform(delete(ENTITY_API_URL_ID, workDetails.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<WorkDetails> workDetailsList = workDetailsRepository.findAll();
        assertThat(workDetailsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
