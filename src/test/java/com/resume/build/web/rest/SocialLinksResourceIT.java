package com.resume.build.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.resume.build.IntegrationTest;
import com.resume.build.domain.SocialLinks;
import com.resume.build.repository.SocialLinksRepository;
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
 * Integration tests for the {@link SocialLinksResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SocialLinksResourceIT {

    private static final String DEFAULT_LABLE = "AAAAAAAAAA";
    private static final String UPDATED_LABLE = "BBBBBBBBBB";

    private static final String DEFAULT_LINK = "AAAAAAAAAA";
    private static final String UPDATED_LINK = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/social-links";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SocialLinksRepository socialLinksRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSocialLinksMockMvc;

    private SocialLinks socialLinks;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SocialLinks createEntity(EntityManager em) {
        SocialLinks socialLinks = new SocialLinks().lable(DEFAULT_LABLE).link(DEFAULT_LINK);
        return socialLinks;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SocialLinks createUpdatedEntity(EntityManager em) {
        SocialLinks socialLinks = new SocialLinks().lable(UPDATED_LABLE).link(UPDATED_LINK);
        return socialLinks;
    }

    @BeforeEach
    public void initTest() {
        socialLinks = createEntity(em);
    }

    @Test
    @Transactional
    void createSocialLinks() throws Exception {
        int databaseSizeBeforeCreate = socialLinksRepository.findAll().size();
        // Create the SocialLinks
        restSocialLinksMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(socialLinks)))
            .andExpect(status().isCreated());

        // Validate the SocialLinks in the database
        List<SocialLinks> socialLinksList = socialLinksRepository.findAll();
        assertThat(socialLinksList).hasSize(databaseSizeBeforeCreate + 1);
        SocialLinks testSocialLinks = socialLinksList.get(socialLinksList.size() - 1);
        assertThat(testSocialLinks.getLable()).isEqualTo(DEFAULT_LABLE);
        assertThat(testSocialLinks.getLink()).isEqualTo(DEFAULT_LINK);
    }

    @Test
    @Transactional
    void createSocialLinksWithExistingId() throws Exception {
        // Create the SocialLinks with an existing ID
        socialLinks.setId(1L);

        int databaseSizeBeforeCreate = socialLinksRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSocialLinksMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(socialLinks)))
            .andExpect(status().isBadRequest());

        // Validate the SocialLinks in the database
        List<SocialLinks> socialLinksList = socialLinksRepository.findAll();
        assertThat(socialLinksList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSocialLinks() throws Exception {
        // Initialize the database
        socialLinksRepository.saveAndFlush(socialLinks);

        // Get all the socialLinksList
        restSocialLinksMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(socialLinks.getId().intValue())))
            .andExpect(jsonPath("$.[*].lable").value(hasItem(DEFAULT_LABLE)))
            .andExpect(jsonPath("$.[*].link").value(hasItem(DEFAULT_LINK)));
    }

    @Test
    @Transactional
    void getSocialLinks() throws Exception {
        // Initialize the database
        socialLinksRepository.saveAndFlush(socialLinks);

        // Get the socialLinks
        restSocialLinksMockMvc
            .perform(get(ENTITY_API_URL_ID, socialLinks.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(socialLinks.getId().intValue()))
            .andExpect(jsonPath("$.lable").value(DEFAULT_LABLE))
            .andExpect(jsonPath("$.link").value(DEFAULT_LINK));
    }

    @Test
    @Transactional
    void getNonExistingSocialLinks() throws Exception {
        // Get the socialLinks
        restSocialLinksMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewSocialLinks() throws Exception {
        // Initialize the database
        socialLinksRepository.saveAndFlush(socialLinks);

        int databaseSizeBeforeUpdate = socialLinksRepository.findAll().size();

        // Update the socialLinks
        SocialLinks updatedSocialLinks = socialLinksRepository.findById(socialLinks.getId()).get();
        // Disconnect from session so that the updates on updatedSocialLinks are not directly saved in db
        em.detach(updatedSocialLinks);
        updatedSocialLinks.lable(UPDATED_LABLE).link(UPDATED_LINK);

        restSocialLinksMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSocialLinks.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSocialLinks))
            )
            .andExpect(status().isOk());

        // Validate the SocialLinks in the database
        List<SocialLinks> socialLinksList = socialLinksRepository.findAll();
        assertThat(socialLinksList).hasSize(databaseSizeBeforeUpdate);
        SocialLinks testSocialLinks = socialLinksList.get(socialLinksList.size() - 1);
        assertThat(testSocialLinks.getLable()).isEqualTo(UPDATED_LABLE);
        assertThat(testSocialLinks.getLink()).isEqualTo(UPDATED_LINK);
    }

    @Test
    @Transactional
    void putNonExistingSocialLinks() throws Exception {
        int databaseSizeBeforeUpdate = socialLinksRepository.findAll().size();
        socialLinks.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSocialLinksMockMvc
            .perform(
                put(ENTITY_API_URL_ID, socialLinks.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(socialLinks))
            )
            .andExpect(status().isBadRequest());

        // Validate the SocialLinks in the database
        List<SocialLinks> socialLinksList = socialLinksRepository.findAll();
        assertThat(socialLinksList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSocialLinks() throws Exception {
        int databaseSizeBeforeUpdate = socialLinksRepository.findAll().size();
        socialLinks.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSocialLinksMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(socialLinks))
            )
            .andExpect(status().isBadRequest());

        // Validate the SocialLinks in the database
        List<SocialLinks> socialLinksList = socialLinksRepository.findAll();
        assertThat(socialLinksList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSocialLinks() throws Exception {
        int databaseSizeBeforeUpdate = socialLinksRepository.findAll().size();
        socialLinks.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSocialLinksMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(socialLinks)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the SocialLinks in the database
        List<SocialLinks> socialLinksList = socialLinksRepository.findAll();
        assertThat(socialLinksList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSocialLinksWithPatch() throws Exception {
        // Initialize the database
        socialLinksRepository.saveAndFlush(socialLinks);

        int databaseSizeBeforeUpdate = socialLinksRepository.findAll().size();

        // Update the socialLinks using partial update
        SocialLinks partialUpdatedSocialLinks = new SocialLinks();
        partialUpdatedSocialLinks.setId(socialLinks.getId());

        partialUpdatedSocialLinks.lable(UPDATED_LABLE);

        restSocialLinksMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSocialLinks.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSocialLinks))
            )
            .andExpect(status().isOk());

        // Validate the SocialLinks in the database
        List<SocialLinks> socialLinksList = socialLinksRepository.findAll();
        assertThat(socialLinksList).hasSize(databaseSizeBeforeUpdate);
        SocialLinks testSocialLinks = socialLinksList.get(socialLinksList.size() - 1);
        assertThat(testSocialLinks.getLable()).isEqualTo(UPDATED_LABLE);
        assertThat(testSocialLinks.getLink()).isEqualTo(DEFAULT_LINK);
    }

    @Test
    @Transactional
    void fullUpdateSocialLinksWithPatch() throws Exception {
        // Initialize the database
        socialLinksRepository.saveAndFlush(socialLinks);

        int databaseSizeBeforeUpdate = socialLinksRepository.findAll().size();

        // Update the socialLinks using partial update
        SocialLinks partialUpdatedSocialLinks = new SocialLinks();
        partialUpdatedSocialLinks.setId(socialLinks.getId());

        partialUpdatedSocialLinks.lable(UPDATED_LABLE).link(UPDATED_LINK);

        restSocialLinksMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSocialLinks.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSocialLinks))
            )
            .andExpect(status().isOk());

        // Validate the SocialLinks in the database
        List<SocialLinks> socialLinksList = socialLinksRepository.findAll();
        assertThat(socialLinksList).hasSize(databaseSizeBeforeUpdate);
        SocialLinks testSocialLinks = socialLinksList.get(socialLinksList.size() - 1);
        assertThat(testSocialLinks.getLable()).isEqualTo(UPDATED_LABLE);
        assertThat(testSocialLinks.getLink()).isEqualTo(UPDATED_LINK);
    }

    @Test
    @Transactional
    void patchNonExistingSocialLinks() throws Exception {
        int databaseSizeBeforeUpdate = socialLinksRepository.findAll().size();
        socialLinks.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSocialLinksMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, socialLinks.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(socialLinks))
            )
            .andExpect(status().isBadRequest());

        // Validate the SocialLinks in the database
        List<SocialLinks> socialLinksList = socialLinksRepository.findAll();
        assertThat(socialLinksList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSocialLinks() throws Exception {
        int databaseSizeBeforeUpdate = socialLinksRepository.findAll().size();
        socialLinks.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSocialLinksMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(socialLinks))
            )
            .andExpect(status().isBadRequest());

        // Validate the SocialLinks in the database
        List<SocialLinks> socialLinksList = socialLinksRepository.findAll();
        assertThat(socialLinksList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSocialLinks() throws Exception {
        int databaseSizeBeforeUpdate = socialLinksRepository.findAll().size();
        socialLinks.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSocialLinksMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(socialLinks))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SocialLinks in the database
        List<SocialLinks> socialLinksList = socialLinksRepository.findAll();
        assertThat(socialLinksList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSocialLinks() throws Exception {
        // Initialize the database
        socialLinksRepository.saveAndFlush(socialLinks);

        int databaseSizeBeforeDelete = socialLinksRepository.findAll().size();

        // Delete the socialLinks
        restSocialLinksMockMvc
            .perform(delete(ENTITY_API_URL_ID, socialLinks.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SocialLinks> socialLinksList = socialLinksRepository.findAll();
        assertThat(socialLinksList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
