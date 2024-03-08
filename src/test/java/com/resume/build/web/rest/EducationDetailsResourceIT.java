package com.resume.build.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.resume.build.IntegrationTest;
import com.resume.build.domain.EducationDetails;
import com.resume.build.repository.EducationDetailsRepository;
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
 * Integration tests for the {@link EducationDetailsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EducationDetailsResourceIT {

    private static final String DEFAULT_SCHOOL_NAME = "AAAAAAAAAA";
    private static final String UPDATED_SCHOOL_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_CITY = "AAAAAAAAAA";
    private static final String UPDATED_CITY = "BBBBBBBBBB";

    private static final String DEFAULT_STATE = "AAAAAAAAAA";
    private static final String UPDATED_STATE = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_START_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_START_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_END_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_END_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_DEGREE = "AAAAAAAAAA";
    private static final String UPDATED_DEGREE = "BBBBBBBBBB";

    private static final String DEFAULT_FIELDOF_STUDY = "AAAAAAAAAA";
    private static final String UPDATED_FIELDOF_STUDY = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_GRADUATION_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_GRADUATION_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_EDUCATION_SUMMARY = "AAAAAAAAAA";
    private static final String UPDATED_EDUCATION_SUMMARY = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/education-details";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EducationDetailsRepository educationDetailsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEducationDetailsMockMvc;

    private EducationDetails educationDetails;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EducationDetails createEntity(EntityManager em) {
        EducationDetails educationDetails = new EducationDetails()
            .schoolName(DEFAULT_SCHOOL_NAME)
            .city(DEFAULT_CITY)
            .state(DEFAULT_STATE)
            .startDate(DEFAULT_START_DATE)
            .endDate(DEFAULT_END_DATE)
            .degree(DEFAULT_DEGREE)
            .fieldofStudy(DEFAULT_FIELDOF_STUDY)
            .graduationDate(DEFAULT_GRADUATION_DATE)
            .educationSummary(DEFAULT_EDUCATION_SUMMARY);
        return educationDetails;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EducationDetails createUpdatedEntity(EntityManager em) {
        EducationDetails educationDetails = new EducationDetails()
            .schoolName(UPDATED_SCHOOL_NAME)
            .city(UPDATED_CITY)
            .state(UPDATED_STATE)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .degree(UPDATED_DEGREE)
            .fieldofStudy(UPDATED_FIELDOF_STUDY)
            .graduationDate(UPDATED_GRADUATION_DATE)
            .educationSummary(UPDATED_EDUCATION_SUMMARY);
        return educationDetails;
    }

    @BeforeEach
    public void initTest() {
        educationDetails = createEntity(em);
    }

    @Test
    @Transactional
    void createEducationDetails() throws Exception {
        int databaseSizeBeforeCreate = educationDetailsRepository.findAll().size();
        // Create the EducationDetails
        restEducationDetailsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(educationDetails))
            )
            .andExpect(status().isCreated());

        // Validate the EducationDetails in the database
        List<EducationDetails> educationDetailsList = educationDetailsRepository.findAll();
        assertThat(educationDetailsList).hasSize(databaseSizeBeforeCreate + 1);
        EducationDetails testEducationDetails = educationDetailsList.get(educationDetailsList.size() - 1);
        assertThat(testEducationDetails.getSchoolName()).isEqualTo(DEFAULT_SCHOOL_NAME);
        assertThat(testEducationDetails.getCity()).isEqualTo(DEFAULT_CITY);
        assertThat(testEducationDetails.getState()).isEqualTo(DEFAULT_STATE);
        assertThat(testEducationDetails.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testEducationDetails.getEndDate()).isEqualTo(DEFAULT_END_DATE);
        assertThat(testEducationDetails.getDegree()).isEqualTo(DEFAULT_DEGREE);
        assertThat(testEducationDetails.getFieldofStudy()).isEqualTo(DEFAULT_FIELDOF_STUDY);
        assertThat(testEducationDetails.getGraduationDate()).isEqualTo(DEFAULT_GRADUATION_DATE);
        assertThat(testEducationDetails.getEducationSummary()).isEqualTo(DEFAULT_EDUCATION_SUMMARY);
    }

    @Test
    @Transactional
    void createEducationDetailsWithExistingId() throws Exception {
        // Create the EducationDetails with an existing ID
        educationDetails.setId(1L);

        int databaseSizeBeforeCreate = educationDetailsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEducationDetailsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(educationDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the EducationDetails in the database
        List<EducationDetails> educationDetailsList = educationDetailsRepository.findAll();
        assertThat(educationDetailsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkSchoolNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = educationDetailsRepository.findAll().size();
        // set the field null
        educationDetails.setSchoolName(null);

        // Create the EducationDetails, which fails.

        restEducationDetailsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(educationDetails))
            )
            .andExpect(status().isBadRequest());

        List<EducationDetails> educationDetailsList = educationDetailsRepository.findAll();
        assertThat(educationDetailsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllEducationDetails() throws Exception {
        // Initialize the database
        educationDetailsRepository.saveAndFlush(educationDetails);

        // Get all the educationDetailsList
        restEducationDetailsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(educationDetails.getId().intValue())))
            .andExpect(jsonPath("$.[*].schoolName").value(hasItem(DEFAULT_SCHOOL_NAME)))
            .andExpect(jsonPath("$.[*].city").value(hasItem(DEFAULT_CITY)))
            .andExpect(jsonPath("$.[*].state").value(hasItem(DEFAULT_STATE)))
            .andExpect(jsonPath("$.[*].startDate").value(hasItem(DEFAULT_START_DATE.toString())))
            .andExpect(jsonPath("$.[*].endDate").value(hasItem(DEFAULT_END_DATE.toString())))
            .andExpect(jsonPath("$.[*].degree").value(hasItem(DEFAULT_DEGREE)))
            .andExpect(jsonPath("$.[*].fieldofStudy").value(hasItem(DEFAULT_FIELDOF_STUDY)))
            .andExpect(jsonPath("$.[*].graduationDate").value(hasItem(DEFAULT_GRADUATION_DATE.toString())))
            .andExpect(jsonPath("$.[*].educationSummary").value(hasItem(DEFAULT_EDUCATION_SUMMARY.toString())));
    }

    @Test
    @Transactional
    void getEducationDetails() throws Exception {
        // Initialize the database
        educationDetailsRepository.saveAndFlush(educationDetails);

        // Get the educationDetails
        restEducationDetailsMockMvc
            .perform(get(ENTITY_API_URL_ID, educationDetails.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(educationDetails.getId().intValue()))
            .andExpect(jsonPath("$.schoolName").value(DEFAULT_SCHOOL_NAME))
            .andExpect(jsonPath("$.city").value(DEFAULT_CITY))
            .andExpect(jsonPath("$.state").value(DEFAULT_STATE))
            .andExpect(jsonPath("$.startDate").value(DEFAULT_START_DATE.toString()))
            .andExpect(jsonPath("$.endDate").value(DEFAULT_END_DATE.toString()))
            .andExpect(jsonPath("$.degree").value(DEFAULT_DEGREE))
            .andExpect(jsonPath("$.fieldofStudy").value(DEFAULT_FIELDOF_STUDY))
            .andExpect(jsonPath("$.graduationDate").value(DEFAULT_GRADUATION_DATE.toString()))
            .andExpect(jsonPath("$.educationSummary").value(DEFAULT_EDUCATION_SUMMARY.toString()));
    }

    @Test
    @Transactional
    void getNonExistingEducationDetails() throws Exception {
        // Get the educationDetails
        restEducationDetailsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewEducationDetails() throws Exception {
        // Initialize the database
        educationDetailsRepository.saveAndFlush(educationDetails);

        int databaseSizeBeforeUpdate = educationDetailsRepository.findAll().size();

        // Update the educationDetails
        EducationDetails updatedEducationDetails = educationDetailsRepository.findById(educationDetails.getId()).get();
        // Disconnect from session so that the updates on updatedEducationDetails are not directly saved in db
        em.detach(updatedEducationDetails);
        updatedEducationDetails
            .schoolName(UPDATED_SCHOOL_NAME)
            .city(UPDATED_CITY)
            .state(UPDATED_STATE)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .degree(UPDATED_DEGREE)
            .fieldofStudy(UPDATED_FIELDOF_STUDY)
            .graduationDate(UPDATED_GRADUATION_DATE)
            .educationSummary(UPDATED_EDUCATION_SUMMARY);

        restEducationDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEducationDetails.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEducationDetails))
            )
            .andExpect(status().isOk());

        // Validate the EducationDetails in the database
        List<EducationDetails> educationDetailsList = educationDetailsRepository.findAll();
        assertThat(educationDetailsList).hasSize(databaseSizeBeforeUpdate);
        EducationDetails testEducationDetails = educationDetailsList.get(educationDetailsList.size() - 1);
        assertThat(testEducationDetails.getSchoolName()).isEqualTo(UPDATED_SCHOOL_NAME);
        assertThat(testEducationDetails.getCity()).isEqualTo(UPDATED_CITY);
        assertThat(testEducationDetails.getState()).isEqualTo(UPDATED_STATE);
        assertThat(testEducationDetails.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testEducationDetails.getEndDate()).isEqualTo(UPDATED_END_DATE);
        assertThat(testEducationDetails.getDegree()).isEqualTo(UPDATED_DEGREE);
        assertThat(testEducationDetails.getFieldofStudy()).isEqualTo(UPDATED_FIELDOF_STUDY);
        assertThat(testEducationDetails.getGraduationDate()).isEqualTo(UPDATED_GRADUATION_DATE);
        assertThat(testEducationDetails.getEducationSummary()).isEqualTo(UPDATED_EDUCATION_SUMMARY);
    }

    @Test
    @Transactional
    void putNonExistingEducationDetails() throws Exception {
        int databaseSizeBeforeUpdate = educationDetailsRepository.findAll().size();
        educationDetails.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEducationDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, educationDetails.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(educationDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the EducationDetails in the database
        List<EducationDetails> educationDetailsList = educationDetailsRepository.findAll();
        assertThat(educationDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEducationDetails() throws Exception {
        int databaseSizeBeforeUpdate = educationDetailsRepository.findAll().size();
        educationDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEducationDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(educationDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the EducationDetails in the database
        List<EducationDetails> educationDetailsList = educationDetailsRepository.findAll();
        assertThat(educationDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEducationDetails() throws Exception {
        int databaseSizeBeforeUpdate = educationDetailsRepository.findAll().size();
        educationDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEducationDetailsMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(educationDetails))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EducationDetails in the database
        List<EducationDetails> educationDetailsList = educationDetailsRepository.findAll();
        assertThat(educationDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEducationDetailsWithPatch() throws Exception {
        // Initialize the database
        educationDetailsRepository.saveAndFlush(educationDetails);

        int databaseSizeBeforeUpdate = educationDetailsRepository.findAll().size();

        // Update the educationDetails using partial update
        EducationDetails partialUpdatedEducationDetails = new EducationDetails();
        partialUpdatedEducationDetails.setId(educationDetails.getId());

        partialUpdatedEducationDetails
            .city(UPDATED_CITY)
            .state(UPDATED_STATE)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .fieldofStudy(UPDATED_FIELDOF_STUDY);

        restEducationDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEducationDetails.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEducationDetails))
            )
            .andExpect(status().isOk());

        // Validate the EducationDetails in the database
        List<EducationDetails> educationDetailsList = educationDetailsRepository.findAll();
        assertThat(educationDetailsList).hasSize(databaseSizeBeforeUpdate);
        EducationDetails testEducationDetails = educationDetailsList.get(educationDetailsList.size() - 1);
        assertThat(testEducationDetails.getSchoolName()).isEqualTo(DEFAULT_SCHOOL_NAME);
        assertThat(testEducationDetails.getCity()).isEqualTo(UPDATED_CITY);
        assertThat(testEducationDetails.getState()).isEqualTo(UPDATED_STATE);
        assertThat(testEducationDetails.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testEducationDetails.getEndDate()).isEqualTo(UPDATED_END_DATE);
        assertThat(testEducationDetails.getDegree()).isEqualTo(DEFAULT_DEGREE);
        assertThat(testEducationDetails.getFieldofStudy()).isEqualTo(UPDATED_FIELDOF_STUDY);
        assertThat(testEducationDetails.getGraduationDate()).isEqualTo(DEFAULT_GRADUATION_DATE);
        assertThat(testEducationDetails.getEducationSummary()).isEqualTo(DEFAULT_EDUCATION_SUMMARY);
    }

    @Test
    @Transactional
    void fullUpdateEducationDetailsWithPatch() throws Exception {
        // Initialize the database
        educationDetailsRepository.saveAndFlush(educationDetails);

        int databaseSizeBeforeUpdate = educationDetailsRepository.findAll().size();

        // Update the educationDetails using partial update
        EducationDetails partialUpdatedEducationDetails = new EducationDetails();
        partialUpdatedEducationDetails.setId(educationDetails.getId());

        partialUpdatedEducationDetails
            .schoolName(UPDATED_SCHOOL_NAME)
            .city(UPDATED_CITY)
            .state(UPDATED_STATE)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .degree(UPDATED_DEGREE)
            .fieldofStudy(UPDATED_FIELDOF_STUDY)
            .graduationDate(UPDATED_GRADUATION_DATE)
            .educationSummary(UPDATED_EDUCATION_SUMMARY);

        restEducationDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEducationDetails.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEducationDetails))
            )
            .andExpect(status().isOk());

        // Validate the EducationDetails in the database
        List<EducationDetails> educationDetailsList = educationDetailsRepository.findAll();
        assertThat(educationDetailsList).hasSize(databaseSizeBeforeUpdate);
        EducationDetails testEducationDetails = educationDetailsList.get(educationDetailsList.size() - 1);
        assertThat(testEducationDetails.getSchoolName()).isEqualTo(UPDATED_SCHOOL_NAME);
        assertThat(testEducationDetails.getCity()).isEqualTo(UPDATED_CITY);
        assertThat(testEducationDetails.getState()).isEqualTo(UPDATED_STATE);
        assertThat(testEducationDetails.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testEducationDetails.getEndDate()).isEqualTo(UPDATED_END_DATE);
        assertThat(testEducationDetails.getDegree()).isEqualTo(UPDATED_DEGREE);
        assertThat(testEducationDetails.getFieldofStudy()).isEqualTo(UPDATED_FIELDOF_STUDY);
        assertThat(testEducationDetails.getGraduationDate()).isEqualTo(UPDATED_GRADUATION_DATE);
        assertThat(testEducationDetails.getEducationSummary()).isEqualTo(UPDATED_EDUCATION_SUMMARY);
    }

    @Test
    @Transactional
    void patchNonExistingEducationDetails() throws Exception {
        int databaseSizeBeforeUpdate = educationDetailsRepository.findAll().size();
        educationDetails.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEducationDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, educationDetails.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(educationDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the EducationDetails in the database
        List<EducationDetails> educationDetailsList = educationDetailsRepository.findAll();
        assertThat(educationDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEducationDetails() throws Exception {
        int databaseSizeBeforeUpdate = educationDetailsRepository.findAll().size();
        educationDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEducationDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(educationDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the EducationDetails in the database
        List<EducationDetails> educationDetailsList = educationDetailsRepository.findAll();
        assertThat(educationDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEducationDetails() throws Exception {
        int databaseSizeBeforeUpdate = educationDetailsRepository.findAll().size();
        educationDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEducationDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(educationDetails))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EducationDetails in the database
        List<EducationDetails> educationDetailsList = educationDetailsRepository.findAll();
        assertThat(educationDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEducationDetails() throws Exception {
        // Initialize the database
        educationDetailsRepository.saveAndFlush(educationDetails);

        int databaseSizeBeforeDelete = educationDetailsRepository.findAll().size();

        // Delete the educationDetails
        restEducationDetailsMockMvc
            .perform(delete(ENTITY_API_URL_ID, educationDetails.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<EducationDetails> educationDetailsList = educationDetailsRepository.findAll();
        assertThat(educationDetailsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
