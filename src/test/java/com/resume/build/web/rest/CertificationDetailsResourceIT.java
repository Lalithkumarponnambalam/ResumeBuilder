package com.resume.build.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.resume.build.IntegrationTest;
import com.resume.build.domain.CertificationDetails;
import com.resume.build.repository.CertificationDetailsRepository;
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
 * Integration tests for the {@link CertificationDetailsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CertificationDetailsResourceIT {

    private static final String DEFAULT_CERTIFICATE_NAME = "AAAAAAAAAA";
    private static final String UPDATED_CERTIFICATE_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_INSTITUTION = "AAAAAAAAAA";
    private static final String UPDATED_INSTITUTION = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_CERTIFICATE_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_CERTIFICATE_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_CERTIFICATION_SUMMARY = "AAAAAAAAAA";
    private static final String UPDATED_CERTIFICATION_SUMMARY = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/certification-details";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CertificationDetailsRepository certificationDetailsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCertificationDetailsMockMvc;

    private CertificationDetails certificationDetails;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CertificationDetails createEntity(EntityManager em) {
        CertificationDetails certificationDetails = new CertificationDetails()
            .certificateName(DEFAULT_CERTIFICATE_NAME)
            .institution(DEFAULT_INSTITUTION)
            .certificateDate(DEFAULT_CERTIFICATE_DATE)
            .certificationSummary(DEFAULT_CERTIFICATION_SUMMARY);
        return certificationDetails;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CertificationDetails createUpdatedEntity(EntityManager em) {
        CertificationDetails certificationDetails = new CertificationDetails()
            .certificateName(UPDATED_CERTIFICATE_NAME)
            .institution(UPDATED_INSTITUTION)
            .certificateDate(UPDATED_CERTIFICATE_DATE)
            .certificationSummary(UPDATED_CERTIFICATION_SUMMARY);
        return certificationDetails;
    }

    @BeforeEach
    public void initTest() {
        certificationDetails = createEntity(em);
    }

    @Test
    @Transactional
    void createCertificationDetails() throws Exception {
        int databaseSizeBeforeCreate = certificationDetailsRepository.findAll().size();
        // Create the CertificationDetails
        restCertificationDetailsMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(certificationDetails))
            )
            .andExpect(status().isCreated());

        // Validate the CertificationDetails in the database
        List<CertificationDetails> certificationDetailsList = certificationDetailsRepository.findAll();
        assertThat(certificationDetailsList).hasSize(databaseSizeBeforeCreate + 1);
        CertificationDetails testCertificationDetails = certificationDetailsList.get(certificationDetailsList.size() - 1);
        assertThat(testCertificationDetails.getCertificateName()).isEqualTo(DEFAULT_CERTIFICATE_NAME);
        assertThat(testCertificationDetails.getInstitution()).isEqualTo(DEFAULT_INSTITUTION);
        assertThat(testCertificationDetails.getCertificateDate()).isEqualTo(DEFAULT_CERTIFICATE_DATE);
        assertThat(testCertificationDetails.getCertificationSummary()).isEqualTo(DEFAULT_CERTIFICATION_SUMMARY);
    }

    @Test
    @Transactional
    void createCertificationDetailsWithExistingId() throws Exception {
        // Create the CertificationDetails with an existing ID
        certificationDetails.setId(1L);

        int databaseSizeBeforeCreate = certificationDetailsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCertificationDetailsMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(certificationDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the CertificationDetails in the database
        List<CertificationDetails> certificationDetailsList = certificationDetailsRepository.findAll();
        assertThat(certificationDetailsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCertificationDetails() throws Exception {
        // Initialize the database
        certificationDetailsRepository.saveAndFlush(certificationDetails);

        // Get all the certificationDetailsList
        restCertificationDetailsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(certificationDetails.getId().intValue())))
            .andExpect(jsonPath("$.[*].certificateName").value(hasItem(DEFAULT_CERTIFICATE_NAME)))
            .andExpect(jsonPath("$.[*].institution").value(hasItem(DEFAULT_INSTITUTION)))
            .andExpect(jsonPath("$.[*].certificateDate").value(hasItem(DEFAULT_CERTIFICATE_DATE.toString())))
            .andExpect(jsonPath("$.[*].certificationSummary").value(hasItem(DEFAULT_CERTIFICATION_SUMMARY.toString())));
    }

    @Test
    @Transactional
    void getCertificationDetails() throws Exception {
        // Initialize the database
        certificationDetailsRepository.saveAndFlush(certificationDetails);

        // Get the certificationDetails
        restCertificationDetailsMockMvc
            .perform(get(ENTITY_API_URL_ID, certificationDetails.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(certificationDetails.getId().intValue()))
            .andExpect(jsonPath("$.certificateName").value(DEFAULT_CERTIFICATE_NAME))
            .andExpect(jsonPath("$.institution").value(DEFAULT_INSTITUTION))
            .andExpect(jsonPath("$.certificateDate").value(DEFAULT_CERTIFICATE_DATE.toString()))
            .andExpect(jsonPath("$.certificationSummary").value(DEFAULT_CERTIFICATION_SUMMARY.toString()));
    }

    @Test
    @Transactional
    void getNonExistingCertificationDetails() throws Exception {
        // Get the certificationDetails
        restCertificationDetailsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewCertificationDetails() throws Exception {
        // Initialize the database
        certificationDetailsRepository.saveAndFlush(certificationDetails);

        int databaseSizeBeforeUpdate = certificationDetailsRepository.findAll().size();

        // Update the certificationDetails
        CertificationDetails updatedCertificationDetails = certificationDetailsRepository.findById(certificationDetails.getId()).get();
        // Disconnect from session so that the updates on updatedCertificationDetails are not directly saved in db
        em.detach(updatedCertificationDetails);
        updatedCertificationDetails
            .certificateName(UPDATED_CERTIFICATE_NAME)
            .institution(UPDATED_INSTITUTION)
            .certificateDate(UPDATED_CERTIFICATE_DATE)
            .certificationSummary(UPDATED_CERTIFICATION_SUMMARY);

        restCertificationDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCertificationDetails.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCertificationDetails))
            )
            .andExpect(status().isOk());

        // Validate the CertificationDetails in the database
        List<CertificationDetails> certificationDetailsList = certificationDetailsRepository.findAll();
        assertThat(certificationDetailsList).hasSize(databaseSizeBeforeUpdate);
        CertificationDetails testCertificationDetails = certificationDetailsList.get(certificationDetailsList.size() - 1);
        assertThat(testCertificationDetails.getCertificateName()).isEqualTo(UPDATED_CERTIFICATE_NAME);
        assertThat(testCertificationDetails.getInstitution()).isEqualTo(UPDATED_INSTITUTION);
        assertThat(testCertificationDetails.getCertificateDate()).isEqualTo(UPDATED_CERTIFICATE_DATE);
        assertThat(testCertificationDetails.getCertificationSummary()).isEqualTo(UPDATED_CERTIFICATION_SUMMARY);
    }

    @Test
    @Transactional
    void putNonExistingCertificationDetails() throws Exception {
        int databaseSizeBeforeUpdate = certificationDetailsRepository.findAll().size();
        certificationDetails.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCertificationDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, certificationDetails.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(certificationDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the CertificationDetails in the database
        List<CertificationDetails> certificationDetailsList = certificationDetailsRepository.findAll();
        assertThat(certificationDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCertificationDetails() throws Exception {
        int databaseSizeBeforeUpdate = certificationDetailsRepository.findAll().size();
        certificationDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCertificationDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(certificationDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the CertificationDetails in the database
        List<CertificationDetails> certificationDetailsList = certificationDetailsRepository.findAll();
        assertThat(certificationDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCertificationDetails() throws Exception {
        int databaseSizeBeforeUpdate = certificationDetailsRepository.findAll().size();
        certificationDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCertificationDetailsMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(certificationDetails))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CertificationDetails in the database
        List<CertificationDetails> certificationDetailsList = certificationDetailsRepository.findAll();
        assertThat(certificationDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCertificationDetailsWithPatch() throws Exception {
        // Initialize the database
        certificationDetailsRepository.saveAndFlush(certificationDetails);

        int databaseSizeBeforeUpdate = certificationDetailsRepository.findAll().size();

        // Update the certificationDetails using partial update
        CertificationDetails partialUpdatedCertificationDetails = new CertificationDetails();
        partialUpdatedCertificationDetails.setId(certificationDetails.getId());

        partialUpdatedCertificationDetails.institution(UPDATED_INSTITUTION).certificationSummary(UPDATED_CERTIFICATION_SUMMARY);

        restCertificationDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCertificationDetails.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCertificationDetails))
            )
            .andExpect(status().isOk());

        // Validate the CertificationDetails in the database
        List<CertificationDetails> certificationDetailsList = certificationDetailsRepository.findAll();
        assertThat(certificationDetailsList).hasSize(databaseSizeBeforeUpdate);
        CertificationDetails testCertificationDetails = certificationDetailsList.get(certificationDetailsList.size() - 1);
        assertThat(testCertificationDetails.getCertificateName()).isEqualTo(DEFAULT_CERTIFICATE_NAME);
        assertThat(testCertificationDetails.getInstitution()).isEqualTo(UPDATED_INSTITUTION);
        assertThat(testCertificationDetails.getCertificateDate()).isEqualTo(DEFAULT_CERTIFICATE_DATE);
        assertThat(testCertificationDetails.getCertificationSummary()).isEqualTo(UPDATED_CERTIFICATION_SUMMARY);
    }

    @Test
    @Transactional
    void fullUpdateCertificationDetailsWithPatch() throws Exception {
        // Initialize the database
        certificationDetailsRepository.saveAndFlush(certificationDetails);

        int databaseSizeBeforeUpdate = certificationDetailsRepository.findAll().size();

        // Update the certificationDetails using partial update
        CertificationDetails partialUpdatedCertificationDetails = new CertificationDetails();
        partialUpdatedCertificationDetails.setId(certificationDetails.getId());

        partialUpdatedCertificationDetails
            .certificateName(UPDATED_CERTIFICATE_NAME)
            .institution(UPDATED_INSTITUTION)
            .certificateDate(UPDATED_CERTIFICATE_DATE)
            .certificationSummary(UPDATED_CERTIFICATION_SUMMARY);

        restCertificationDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCertificationDetails.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCertificationDetails))
            )
            .andExpect(status().isOk());

        // Validate the CertificationDetails in the database
        List<CertificationDetails> certificationDetailsList = certificationDetailsRepository.findAll();
        assertThat(certificationDetailsList).hasSize(databaseSizeBeforeUpdate);
        CertificationDetails testCertificationDetails = certificationDetailsList.get(certificationDetailsList.size() - 1);
        assertThat(testCertificationDetails.getCertificateName()).isEqualTo(UPDATED_CERTIFICATE_NAME);
        assertThat(testCertificationDetails.getInstitution()).isEqualTo(UPDATED_INSTITUTION);
        assertThat(testCertificationDetails.getCertificateDate()).isEqualTo(UPDATED_CERTIFICATE_DATE);
        assertThat(testCertificationDetails.getCertificationSummary()).isEqualTo(UPDATED_CERTIFICATION_SUMMARY);
    }

    @Test
    @Transactional
    void patchNonExistingCertificationDetails() throws Exception {
        int databaseSizeBeforeUpdate = certificationDetailsRepository.findAll().size();
        certificationDetails.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCertificationDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, certificationDetails.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(certificationDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the CertificationDetails in the database
        List<CertificationDetails> certificationDetailsList = certificationDetailsRepository.findAll();
        assertThat(certificationDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCertificationDetails() throws Exception {
        int databaseSizeBeforeUpdate = certificationDetailsRepository.findAll().size();
        certificationDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCertificationDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(certificationDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the CertificationDetails in the database
        List<CertificationDetails> certificationDetailsList = certificationDetailsRepository.findAll();
        assertThat(certificationDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCertificationDetails() throws Exception {
        int databaseSizeBeforeUpdate = certificationDetailsRepository.findAll().size();
        certificationDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCertificationDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(certificationDetails))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CertificationDetails in the database
        List<CertificationDetails> certificationDetailsList = certificationDetailsRepository.findAll();
        assertThat(certificationDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCertificationDetails() throws Exception {
        // Initialize the database
        certificationDetailsRepository.saveAndFlush(certificationDetails);

        int databaseSizeBeforeDelete = certificationDetailsRepository.findAll().size();

        // Delete the certificationDetails
        restCertificationDetailsMockMvc
            .perform(delete(ENTITY_API_URL_ID, certificationDetails.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CertificationDetails> certificationDetailsList = certificationDetailsRepository.findAll();
        assertThat(certificationDetailsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
