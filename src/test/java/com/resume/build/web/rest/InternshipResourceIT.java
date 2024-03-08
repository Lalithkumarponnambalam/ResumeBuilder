package com.resume.build.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.resume.build.IntegrationTest;
import com.resume.build.domain.Internship;
import com.resume.build.repository.InternshipRepository;
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
 * Integration tests for the {@link InternshipResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class InternshipResourceIT {

    private static final String DEFAULT_JOB_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_JOB_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_EMPLOYER = "AAAAAAAAAA";
    private static final String UPDATED_EMPLOYER = "BBBBBBBBBB";

    private static final String DEFAULT_COMPANY_NAME = "AAAAAAAAAA";
    private static final String UPDATED_COMPANY_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_ADDRESS = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_START_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_START_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_END_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_END_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_INTERNSHIP_SUMMARY = "AAAAAAAAAA";
    private static final String UPDATED_INTERNSHIP_SUMMARY = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/internships";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private InternshipRepository internshipRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restInternshipMockMvc;

    private Internship internship;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Internship createEntity(EntityManager em) {
        Internship internship = new Internship()
            .jobTitle(DEFAULT_JOB_TITLE)
            .employer(DEFAULT_EMPLOYER)
            .companyName(DEFAULT_COMPANY_NAME)
            .address(DEFAULT_ADDRESS)
            .startDate(DEFAULT_START_DATE)
            .endDate(DEFAULT_END_DATE)
            .internshipSummary(DEFAULT_INTERNSHIP_SUMMARY);
        return internship;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Internship createUpdatedEntity(EntityManager em) {
        Internship internship = new Internship()
            .jobTitle(UPDATED_JOB_TITLE)
            .employer(UPDATED_EMPLOYER)
            .companyName(UPDATED_COMPANY_NAME)
            .address(UPDATED_ADDRESS)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .internshipSummary(UPDATED_INTERNSHIP_SUMMARY);
        return internship;
    }

    @BeforeEach
    public void initTest() {
        internship = createEntity(em);
    }

    @Test
    @Transactional
    void createInternship() throws Exception {
        int databaseSizeBeforeCreate = internshipRepository.findAll().size();
        // Create the Internship
        restInternshipMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(internship)))
            .andExpect(status().isCreated());

        // Validate the Internship in the database
        List<Internship> internshipList = internshipRepository.findAll();
        assertThat(internshipList).hasSize(databaseSizeBeforeCreate + 1);
        Internship testInternship = internshipList.get(internshipList.size() - 1);
        assertThat(testInternship.getJobTitle()).isEqualTo(DEFAULT_JOB_TITLE);
        assertThat(testInternship.getEmployer()).isEqualTo(DEFAULT_EMPLOYER);
        assertThat(testInternship.getCompanyName()).isEqualTo(DEFAULT_COMPANY_NAME);
        assertThat(testInternship.getAddress()).isEqualTo(DEFAULT_ADDRESS);
        assertThat(testInternship.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testInternship.getEndDate()).isEqualTo(DEFAULT_END_DATE);
        assertThat(testInternship.getInternshipSummary()).isEqualTo(DEFAULT_INTERNSHIP_SUMMARY);
    }

    @Test
    @Transactional
    void createInternshipWithExistingId() throws Exception {
        // Create the Internship with an existing ID
        internship.setId(1L);

        int databaseSizeBeforeCreate = internshipRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restInternshipMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(internship)))
            .andExpect(status().isBadRequest());

        // Validate the Internship in the database
        List<Internship> internshipList = internshipRepository.findAll();
        assertThat(internshipList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllInternships() throws Exception {
        // Initialize the database
        internshipRepository.saveAndFlush(internship);

        // Get all the internshipList
        restInternshipMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(internship.getId().intValue())))
            .andExpect(jsonPath("$.[*].jobTitle").value(hasItem(DEFAULT_JOB_TITLE)))
            .andExpect(jsonPath("$.[*].employer").value(hasItem(DEFAULT_EMPLOYER)))
            .andExpect(jsonPath("$.[*].companyName").value(hasItem(DEFAULT_COMPANY_NAME)))
            .andExpect(jsonPath("$.[*].address").value(hasItem(DEFAULT_ADDRESS)))
            .andExpect(jsonPath("$.[*].startDate").value(hasItem(DEFAULT_START_DATE.toString())))
            .andExpect(jsonPath("$.[*].endDate").value(hasItem(DEFAULT_END_DATE.toString())))
            .andExpect(jsonPath("$.[*].internshipSummary").value(hasItem(DEFAULT_INTERNSHIP_SUMMARY.toString())));
    }

    @Test
    @Transactional
    void getInternship() throws Exception {
        // Initialize the database
        internshipRepository.saveAndFlush(internship);

        // Get the internship
        restInternshipMockMvc
            .perform(get(ENTITY_API_URL_ID, internship.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(internship.getId().intValue()))
            .andExpect(jsonPath("$.jobTitle").value(DEFAULT_JOB_TITLE))
            .andExpect(jsonPath("$.employer").value(DEFAULT_EMPLOYER))
            .andExpect(jsonPath("$.companyName").value(DEFAULT_COMPANY_NAME))
            .andExpect(jsonPath("$.address").value(DEFAULT_ADDRESS))
            .andExpect(jsonPath("$.startDate").value(DEFAULT_START_DATE.toString()))
            .andExpect(jsonPath("$.endDate").value(DEFAULT_END_DATE.toString()))
            .andExpect(jsonPath("$.internshipSummary").value(DEFAULT_INTERNSHIP_SUMMARY.toString()));
    }

    @Test
    @Transactional
    void getNonExistingInternship() throws Exception {
        // Get the internship
        restInternshipMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewInternship() throws Exception {
        // Initialize the database
        internshipRepository.saveAndFlush(internship);

        int databaseSizeBeforeUpdate = internshipRepository.findAll().size();

        // Update the internship
        Internship updatedInternship = internshipRepository.findById(internship.getId()).get();
        // Disconnect from session so that the updates on updatedInternship are not directly saved in db
        em.detach(updatedInternship);
        updatedInternship
            .jobTitle(UPDATED_JOB_TITLE)
            .employer(UPDATED_EMPLOYER)
            .companyName(UPDATED_COMPANY_NAME)
            .address(UPDATED_ADDRESS)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .internshipSummary(UPDATED_INTERNSHIP_SUMMARY);

        restInternshipMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedInternship.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedInternship))
            )
            .andExpect(status().isOk());

        // Validate the Internship in the database
        List<Internship> internshipList = internshipRepository.findAll();
        assertThat(internshipList).hasSize(databaseSizeBeforeUpdate);
        Internship testInternship = internshipList.get(internshipList.size() - 1);
        assertThat(testInternship.getJobTitle()).isEqualTo(UPDATED_JOB_TITLE);
        assertThat(testInternship.getEmployer()).isEqualTo(UPDATED_EMPLOYER);
        assertThat(testInternship.getCompanyName()).isEqualTo(UPDATED_COMPANY_NAME);
        assertThat(testInternship.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testInternship.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testInternship.getEndDate()).isEqualTo(UPDATED_END_DATE);
        assertThat(testInternship.getInternshipSummary()).isEqualTo(UPDATED_INTERNSHIP_SUMMARY);
    }

    @Test
    @Transactional
    void putNonExistingInternship() throws Exception {
        int databaseSizeBeforeUpdate = internshipRepository.findAll().size();
        internship.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restInternshipMockMvc
            .perform(
                put(ENTITY_API_URL_ID, internship.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(internship))
            )
            .andExpect(status().isBadRequest());

        // Validate the Internship in the database
        List<Internship> internshipList = internshipRepository.findAll();
        assertThat(internshipList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchInternship() throws Exception {
        int databaseSizeBeforeUpdate = internshipRepository.findAll().size();
        internship.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInternshipMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(internship))
            )
            .andExpect(status().isBadRequest());

        // Validate the Internship in the database
        List<Internship> internshipList = internshipRepository.findAll();
        assertThat(internshipList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamInternship() throws Exception {
        int databaseSizeBeforeUpdate = internshipRepository.findAll().size();
        internship.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInternshipMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(internship)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Internship in the database
        List<Internship> internshipList = internshipRepository.findAll();
        assertThat(internshipList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateInternshipWithPatch() throws Exception {
        // Initialize the database
        internshipRepository.saveAndFlush(internship);

        int databaseSizeBeforeUpdate = internshipRepository.findAll().size();

        // Update the internship using partial update
        Internship partialUpdatedInternship = new Internship();
        partialUpdatedInternship.setId(internship.getId());

        partialUpdatedInternship.companyName(UPDATED_COMPANY_NAME).endDate(UPDATED_END_DATE);

        restInternshipMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedInternship.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedInternship))
            )
            .andExpect(status().isOk());

        // Validate the Internship in the database
        List<Internship> internshipList = internshipRepository.findAll();
        assertThat(internshipList).hasSize(databaseSizeBeforeUpdate);
        Internship testInternship = internshipList.get(internshipList.size() - 1);
        assertThat(testInternship.getJobTitle()).isEqualTo(DEFAULT_JOB_TITLE);
        assertThat(testInternship.getEmployer()).isEqualTo(DEFAULT_EMPLOYER);
        assertThat(testInternship.getCompanyName()).isEqualTo(UPDATED_COMPANY_NAME);
        assertThat(testInternship.getAddress()).isEqualTo(DEFAULT_ADDRESS);
        assertThat(testInternship.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testInternship.getEndDate()).isEqualTo(UPDATED_END_DATE);
        assertThat(testInternship.getInternshipSummary()).isEqualTo(DEFAULT_INTERNSHIP_SUMMARY);
    }

    @Test
    @Transactional
    void fullUpdateInternshipWithPatch() throws Exception {
        // Initialize the database
        internshipRepository.saveAndFlush(internship);

        int databaseSizeBeforeUpdate = internshipRepository.findAll().size();

        // Update the internship using partial update
        Internship partialUpdatedInternship = new Internship();
        partialUpdatedInternship.setId(internship.getId());

        partialUpdatedInternship
            .jobTitle(UPDATED_JOB_TITLE)
            .employer(UPDATED_EMPLOYER)
            .companyName(UPDATED_COMPANY_NAME)
            .address(UPDATED_ADDRESS)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .internshipSummary(UPDATED_INTERNSHIP_SUMMARY);

        restInternshipMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedInternship.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedInternship))
            )
            .andExpect(status().isOk());

        // Validate the Internship in the database
        List<Internship> internshipList = internshipRepository.findAll();
        assertThat(internshipList).hasSize(databaseSizeBeforeUpdate);
        Internship testInternship = internshipList.get(internshipList.size() - 1);
        assertThat(testInternship.getJobTitle()).isEqualTo(UPDATED_JOB_TITLE);
        assertThat(testInternship.getEmployer()).isEqualTo(UPDATED_EMPLOYER);
        assertThat(testInternship.getCompanyName()).isEqualTo(UPDATED_COMPANY_NAME);
        assertThat(testInternship.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testInternship.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testInternship.getEndDate()).isEqualTo(UPDATED_END_DATE);
        assertThat(testInternship.getInternshipSummary()).isEqualTo(UPDATED_INTERNSHIP_SUMMARY);
    }

    @Test
    @Transactional
    void patchNonExistingInternship() throws Exception {
        int databaseSizeBeforeUpdate = internshipRepository.findAll().size();
        internship.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restInternshipMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, internship.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(internship))
            )
            .andExpect(status().isBadRequest());

        // Validate the Internship in the database
        List<Internship> internshipList = internshipRepository.findAll();
        assertThat(internshipList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchInternship() throws Exception {
        int databaseSizeBeforeUpdate = internshipRepository.findAll().size();
        internship.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInternshipMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(internship))
            )
            .andExpect(status().isBadRequest());

        // Validate the Internship in the database
        List<Internship> internshipList = internshipRepository.findAll();
        assertThat(internshipList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamInternship() throws Exception {
        int databaseSizeBeforeUpdate = internshipRepository.findAll().size();
        internship.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInternshipMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(internship))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Internship in the database
        List<Internship> internshipList = internshipRepository.findAll();
        assertThat(internshipList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteInternship() throws Exception {
        // Initialize the database
        internshipRepository.saveAndFlush(internship);

        int databaseSizeBeforeDelete = internshipRepository.findAll().size();

        // Delete the internship
        restInternshipMockMvc
            .perform(delete(ENTITY_API_URL_ID, internship.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Internship> internshipList = internshipRepository.findAll();
        assertThat(internshipList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
