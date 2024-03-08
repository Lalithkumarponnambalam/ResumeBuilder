package com.resume.build.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.resume.build.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SocialLinksTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SocialLinks.class);
        SocialLinks socialLinks1 = new SocialLinks();
        socialLinks1.setId(1L);
        SocialLinks socialLinks2 = new SocialLinks();
        socialLinks2.setId(socialLinks1.getId());
        assertThat(socialLinks1).isEqualTo(socialLinks2);
        socialLinks2.setId(2L);
        assertThat(socialLinks1).isNotEqualTo(socialLinks2);
        socialLinks1.setId(null);
        assertThat(socialLinks1).isNotEqualTo(socialLinks2);
    }
}
