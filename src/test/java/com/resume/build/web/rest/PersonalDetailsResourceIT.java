package com.resume.build.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.resume.build.IntegrationTest;
import com.resume.build.domain.PersonalDetails;
import com.resume.build.repository.PersonalDetailsRepository;
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
 * Integration tests for the {@link PersonalDetailsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PersonalDetailsResourceIT {

    private static final byte[] DEFAULT_PROFILE_PHOTO = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_PROFILE_PHOTO = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_PROFILE_PHOTO_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_PROFILE_PHOTO_CONTENT_TYPE = "image/png";

    private static final String DEFAULT_FIRST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FIRST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LAST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_PHONE = "AAAAAAAAAA";
    private static final String UPDATED_PHONE = "BBBBBBBBBB";

    private static final String DEFAULT_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_ADDRESS = "BBBBBBBBBB";

    private static final String DEFAULT_CITY = "AAAAAAAAAA";
    private static final String UPDATED_CITY = "BBBBBBBBBB";

    private static final String DEFAULT_STATE = "AAAAAAAAAA";
    private static final String UPDATED_STATE = "BBBBBBBBBB";

    private static final String DEFAULT_ZIP_CODE = "AAAAAAAAAA";
    private static final String UPDATED_ZIP_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_COUNTRY = "AAAAAAAAAA";
    private static final String UPDATED_COUNTRY = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/personal-details";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PersonalDetailsRepository personalDetailsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPersonalDetailsMockMvc;

    private PersonalDetails personalDetails;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PersonalDetails createEntity(EntityManager em) {
        PersonalDetails personalDetails = new PersonalDetails()
            .profilePhoto(DEFAULT_PROFILE_PHOTO)
            .profilePhotoContentType(DEFAULT_PROFILE_PHOTO_CONTENT_TYPE)
            .firstName(DEFAULT_FIRST_NAME)
            .lastName(DEFAULT_LAST_NAME)
            .email(DEFAULT_EMAIL)
            .phone(DEFAULT_PHONE)
            .address(DEFAULT_ADDRESS)
            .city(DEFAULT_CITY)
            .state(DEFAULT_STATE)
            .zipCode(DEFAULT_ZIP_CODE)
            .country(DEFAULT_COUNTRY);
        return personalDetails;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PersonalDetails createUpdatedEntity(EntityManager em) {
        PersonalDetails personalDetails = new PersonalDetails()
            .profilePhoto(UPDATED_PROFILE_PHOTO)
            .profilePhotoContentType(UPDATED_PROFILE_PHOTO_CONTENT_TYPE)
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL)
            .phone(UPDATED_PHONE)
            .address(UPDATED_ADDRESS)
            .city(UPDATED_CITY)
            .state(UPDATED_STATE)
            .zipCode(UPDATED_ZIP_CODE)
            .country(UPDATED_COUNTRY);
        return personalDetails;
    }

    @BeforeEach
    public void initTest() {
        personalDetails = createEntity(em);
    }

    @Test
    @Transactional
    void createPersonalDetails() throws Exception {
        int databaseSizeBeforeCreate = personalDetailsRepository.findAll().size();
        // Create the PersonalDetails
        restPersonalDetailsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(personalDetails))
            )
            .andExpect(status().isCreated());

        // Validate the PersonalDetails in the database
        List<PersonalDetails> personalDetailsList = personalDetailsRepository.findAll();
        assertThat(personalDetailsList).hasSize(databaseSizeBeforeCreate + 1);
        PersonalDetails testPersonalDetails = personalDetailsList.get(personalDetailsList.size() - 1);
        assertThat(testPersonalDetails.getProfilePhoto()).isEqualTo(DEFAULT_PROFILE_PHOTO);
        assertThat(testPersonalDetails.getProfilePhotoContentType()).isEqualTo(DEFAULT_PROFILE_PHOTO_CONTENT_TYPE);
        assertThat(testPersonalDetails.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testPersonalDetails.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
        assertThat(testPersonalDetails.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testPersonalDetails.getPhone()).isEqualTo(DEFAULT_PHONE);
        assertThat(testPersonalDetails.getAddress()).isEqualTo(DEFAULT_ADDRESS);
        assertThat(testPersonalDetails.getCity()).isEqualTo(DEFAULT_CITY);
        assertThat(testPersonalDetails.getState()).isEqualTo(DEFAULT_STATE);
        assertThat(testPersonalDetails.getZipCode()).isEqualTo(DEFAULT_ZIP_CODE);
        assertThat(testPersonalDetails.getCountry()).isEqualTo(DEFAULT_COUNTRY);
    }

    @Test
    @Transactional
    void createPersonalDetailsWithExistingId() throws Exception {
        // Create the PersonalDetails with an existing ID
        personalDetails.setId(1L);

        int databaseSizeBeforeCreate = personalDetailsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPersonalDetailsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(personalDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the PersonalDetails in the database
        List<PersonalDetails> personalDetailsList = personalDetailsRepository.findAll();
        assertThat(personalDetailsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkFirstNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = personalDetailsRepository.findAll().size();
        // set the field null
        personalDetails.setFirstName(null);

        // Create the PersonalDetails, which fails.

        restPersonalDetailsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(personalDetails))
            )
            .andExpect(status().isBadRequest());

        List<PersonalDetails> personalDetailsList = personalDetailsRepository.findAll();
        assertThat(personalDetailsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLastNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = personalDetailsRepository.findAll().size();
        // set the field null
        personalDetails.setLastName(null);

        // Create the PersonalDetails, which fails.

        restPersonalDetailsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(personalDetails))
            )
            .andExpect(status().isBadRequest());

        List<PersonalDetails> personalDetailsList = personalDetailsRepository.findAll();
        assertThat(personalDetailsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEmailIsRequired() throws Exception {
        int databaseSizeBeforeTest = personalDetailsRepository.findAll().size();
        // set the field null
        personalDetails.setEmail(null);

        // Create the PersonalDetails, which fails.

        restPersonalDetailsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(personalDetails))
            )
            .andExpect(status().isBadRequest());

        List<PersonalDetails> personalDetailsList = personalDetailsRepository.findAll();
        assertThat(personalDetailsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllPersonalDetails() throws Exception {
        // Initialize the database
        personalDetailsRepository.saveAndFlush(personalDetails);

        // Get all the personalDetailsList
        restPersonalDetailsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(personalDetails.getId().intValue())))
            .andExpect(jsonPath("$.[*].profilePhotoContentType").value(hasItem(DEFAULT_PROFILE_PHOTO_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].profilePhoto").value(hasItem(Base64Utils.encodeToString(DEFAULT_PROFILE_PHOTO))))
            .andExpect(jsonPath("$.[*].firstName").value(hasItem(DEFAULT_FIRST_NAME)))
            .andExpect(jsonPath("$.[*].lastName").value(hasItem(DEFAULT_LAST_NAME)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].phone").value(hasItem(DEFAULT_PHONE)))
            .andExpect(jsonPath("$.[*].address").value(hasItem(DEFAULT_ADDRESS)))
            .andExpect(jsonPath("$.[*].city").value(hasItem(DEFAULT_CITY)))
            .andExpect(jsonPath("$.[*].state").value(hasItem(DEFAULT_STATE)))
            .andExpect(jsonPath("$.[*].zipCode").value(hasItem(DEFAULT_ZIP_CODE)))
            .andExpect(jsonPath("$.[*].country").value(hasItem(DEFAULT_COUNTRY)));
    }

    @Test
    @Transactional
    void getPersonalDetails() throws Exception {
        // Initialize the database
        personalDetailsRepository.saveAndFlush(personalDetails);

        // Get the personalDetails
        restPersonalDetailsMockMvc
            .perform(get(ENTITY_API_URL_ID, personalDetails.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(personalDetails.getId().intValue()))
            .andExpect(jsonPath("$.profilePhotoContentType").value(DEFAULT_PROFILE_PHOTO_CONTENT_TYPE))
            .andExpect(jsonPath("$.profilePhoto").value(Base64Utils.encodeToString(DEFAULT_PROFILE_PHOTO)))
            .andExpect(jsonPath("$.firstName").value(DEFAULT_FIRST_NAME))
            .andExpect(jsonPath("$.lastName").value(DEFAULT_LAST_NAME))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.phone").value(DEFAULT_PHONE))
            .andExpect(jsonPath("$.address").value(DEFAULT_ADDRESS))
            .andExpect(jsonPath("$.city").value(DEFAULT_CITY))
            .andExpect(jsonPath("$.state").value(DEFAULT_STATE))
            .andExpect(jsonPath("$.zipCode").value(DEFAULT_ZIP_CODE))
            .andExpect(jsonPath("$.country").value(DEFAULT_COUNTRY));
    }

    @Test
    @Transactional
    void getNonExistingPersonalDetails() throws Exception {
        // Get the personalDetails
        restPersonalDetailsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewPersonalDetails() throws Exception {
        // Initialize the database
        personalDetailsRepository.saveAndFlush(personalDetails);

        int databaseSizeBeforeUpdate = personalDetailsRepository.findAll().size();

        // Update the personalDetails
        PersonalDetails updatedPersonalDetails = personalDetailsRepository.findById(personalDetails.getId()).get();
        // Disconnect from session so that the updates on updatedPersonalDetails are not directly saved in db
        em.detach(updatedPersonalDetails);
        updatedPersonalDetails
            .profilePhoto(UPDATED_PROFILE_PHOTO)
            .profilePhotoContentType(UPDATED_PROFILE_PHOTO_CONTENT_TYPE)
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL)
            .phone(UPDATED_PHONE)
            .address(UPDATED_ADDRESS)
            .city(UPDATED_CITY)
            .state(UPDATED_STATE)
            .zipCode(UPDATED_ZIP_CODE)
            .country(UPDATED_COUNTRY);

        restPersonalDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPersonalDetails.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPersonalDetails))
            )
            .andExpect(status().isOk());

        // Validate the PersonalDetails in the database
        List<PersonalDetails> personalDetailsList = personalDetailsRepository.findAll();
        assertThat(personalDetailsList).hasSize(databaseSizeBeforeUpdate);
        PersonalDetails testPersonalDetails = personalDetailsList.get(personalDetailsList.size() - 1);
        assertThat(testPersonalDetails.getProfilePhoto()).isEqualTo(UPDATED_PROFILE_PHOTO);
        assertThat(testPersonalDetails.getProfilePhotoContentType()).isEqualTo(UPDATED_PROFILE_PHOTO_CONTENT_TYPE);
        assertThat(testPersonalDetails.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testPersonalDetails.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testPersonalDetails.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testPersonalDetails.getPhone()).isEqualTo(UPDATED_PHONE);
        assertThat(testPersonalDetails.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testPersonalDetails.getCity()).isEqualTo(UPDATED_CITY);
        assertThat(testPersonalDetails.getState()).isEqualTo(UPDATED_STATE);
        assertThat(testPersonalDetails.getZipCode()).isEqualTo(UPDATED_ZIP_CODE);
        assertThat(testPersonalDetails.getCountry()).isEqualTo(UPDATED_COUNTRY);
    }

    @Test
    @Transactional
    void putNonExistingPersonalDetails() throws Exception {
        int databaseSizeBeforeUpdate = personalDetailsRepository.findAll().size();
        personalDetails.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPersonalDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, personalDetails.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(personalDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the PersonalDetails in the database
        List<PersonalDetails> personalDetailsList = personalDetailsRepository.findAll();
        assertThat(personalDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPersonalDetails() throws Exception {
        int databaseSizeBeforeUpdate = personalDetailsRepository.findAll().size();
        personalDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPersonalDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(personalDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the PersonalDetails in the database
        List<PersonalDetails> personalDetailsList = personalDetailsRepository.findAll();
        assertThat(personalDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPersonalDetails() throws Exception {
        int databaseSizeBeforeUpdate = personalDetailsRepository.findAll().size();
        personalDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPersonalDetailsMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(personalDetails))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the PersonalDetails in the database
        List<PersonalDetails> personalDetailsList = personalDetailsRepository.findAll();
        assertThat(personalDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePersonalDetailsWithPatch() throws Exception {
        // Initialize the database
        personalDetailsRepository.saveAndFlush(personalDetails);

        int databaseSizeBeforeUpdate = personalDetailsRepository.findAll().size();

        // Update the personalDetails using partial update
        PersonalDetails partialUpdatedPersonalDetails = new PersonalDetails();
        partialUpdatedPersonalDetails.setId(personalDetails.getId());

        partialUpdatedPersonalDetails
            .profilePhoto(UPDATED_PROFILE_PHOTO)
            .profilePhotoContentType(UPDATED_PROFILE_PHOTO_CONTENT_TYPE)
            .firstName(UPDATED_FIRST_NAME)
            .city(UPDATED_CITY)
            .zipCode(UPDATED_ZIP_CODE);

        restPersonalDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPersonalDetails.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPersonalDetails))
            )
            .andExpect(status().isOk());

        // Validate the PersonalDetails in the database
        List<PersonalDetails> personalDetailsList = personalDetailsRepository.findAll();
        assertThat(personalDetailsList).hasSize(databaseSizeBeforeUpdate);
        PersonalDetails testPersonalDetails = personalDetailsList.get(personalDetailsList.size() - 1);
        assertThat(testPersonalDetails.getProfilePhoto()).isEqualTo(UPDATED_PROFILE_PHOTO);
        assertThat(testPersonalDetails.getProfilePhotoContentType()).isEqualTo(UPDATED_PROFILE_PHOTO_CONTENT_TYPE);
        assertThat(testPersonalDetails.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testPersonalDetails.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
        assertThat(testPersonalDetails.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testPersonalDetails.getPhone()).isEqualTo(DEFAULT_PHONE);
        assertThat(testPersonalDetails.getAddress()).isEqualTo(DEFAULT_ADDRESS);
        assertThat(testPersonalDetails.getCity()).isEqualTo(UPDATED_CITY);
        assertThat(testPersonalDetails.getState()).isEqualTo(DEFAULT_STATE);
        assertThat(testPersonalDetails.getZipCode()).isEqualTo(UPDATED_ZIP_CODE);
        assertThat(testPersonalDetails.getCountry()).isEqualTo(DEFAULT_COUNTRY);
    }

    @Test
    @Transactional
    void fullUpdatePersonalDetailsWithPatch() throws Exception {
        // Initialize the database
        personalDetailsRepository.saveAndFlush(personalDetails);

        int databaseSizeBeforeUpdate = personalDetailsRepository.findAll().size();

        // Update the personalDetails using partial update
        PersonalDetails partialUpdatedPersonalDetails = new PersonalDetails();
        partialUpdatedPersonalDetails.setId(personalDetails.getId());

        partialUpdatedPersonalDetails
            .profilePhoto(UPDATED_PROFILE_PHOTO)
            .profilePhotoContentType(UPDATED_PROFILE_PHOTO_CONTENT_TYPE)
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL)
            .phone(UPDATED_PHONE)
            .address(UPDATED_ADDRESS)
            .city(UPDATED_CITY)
            .state(UPDATED_STATE)
            .zipCode(UPDATED_ZIP_CODE)
            .country(UPDATED_COUNTRY);

        restPersonalDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPersonalDetails.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPersonalDetails))
            )
            .andExpect(status().isOk());

        // Validate the PersonalDetails in the database
        List<PersonalDetails> personalDetailsList = personalDetailsRepository.findAll();
        assertThat(personalDetailsList).hasSize(databaseSizeBeforeUpdate);
        PersonalDetails testPersonalDetails = personalDetailsList.get(personalDetailsList.size() - 1);
        assertThat(testPersonalDetails.getProfilePhoto()).isEqualTo(UPDATED_PROFILE_PHOTO);
        assertThat(testPersonalDetails.getProfilePhotoContentType()).isEqualTo(UPDATED_PROFILE_PHOTO_CONTENT_TYPE);
        assertThat(testPersonalDetails.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testPersonalDetails.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testPersonalDetails.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testPersonalDetails.getPhone()).isEqualTo(UPDATED_PHONE);
        assertThat(testPersonalDetails.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testPersonalDetails.getCity()).isEqualTo(UPDATED_CITY);
        assertThat(testPersonalDetails.getState()).isEqualTo(UPDATED_STATE);
        assertThat(testPersonalDetails.getZipCode()).isEqualTo(UPDATED_ZIP_CODE);
        assertThat(testPersonalDetails.getCountry()).isEqualTo(UPDATED_COUNTRY);
    }

    @Test
    @Transactional
    void patchNonExistingPersonalDetails() throws Exception {
        int databaseSizeBeforeUpdate = personalDetailsRepository.findAll().size();
        personalDetails.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPersonalDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, personalDetails.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(personalDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the PersonalDetails in the database
        List<PersonalDetails> personalDetailsList = personalDetailsRepository.findAll();
        assertThat(personalDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPersonalDetails() throws Exception {
        int databaseSizeBeforeUpdate = personalDetailsRepository.findAll().size();
        personalDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPersonalDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(personalDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the PersonalDetails in the database
        List<PersonalDetails> personalDetailsList = personalDetailsRepository.findAll();
        assertThat(personalDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPersonalDetails() throws Exception {
        int databaseSizeBeforeUpdate = personalDetailsRepository.findAll().size();
        personalDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPersonalDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(personalDetails))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the PersonalDetails in the database
        List<PersonalDetails> personalDetailsList = personalDetailsRepository.findAll();
        assertThat(personalDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePersonalDetails() throws Exception {
        // Initialize the database
        personalDetailsRepository.saveAndFlush(personalDetails);

        int databaseSizeBeforeDelete = personalDetailsRepository.findAll().size();

        // Delete the personalDetails
        restPersonalDetailsMockMvc
            .perform(delete(ENTITY_API_URL_ID, personalDetails.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<PersonalDetails> personalDetailsList = personalDetailsRepository.findAll();
        assertThat(personalDetailsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
