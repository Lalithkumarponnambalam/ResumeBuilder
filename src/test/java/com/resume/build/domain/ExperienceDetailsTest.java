package com.resume.build.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.resume.build.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ExperienceDetailsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ExperienceDetails.class);
        ExperienceDetails experienceDetails1 = new ExperienceDetails();
        experienceDetails1.setId(1L);
        ExperienceDetails experienceDetails2 = new ExperienceDetails();
        experienceDetails2.setId(experienceDetails1.getId());
        assertThat(experienceDetails1).isEqualTo(experienceDetails2);
        experienceDetails2.setId(2L);
        assertThat(experienceDetails1).isNotEqualTo(experienceDetails2);
        experienceDetails1.setId(null);
        assertThat(experienceDetails1).isNotEqualTo(experienceDetails2);
    }
}
