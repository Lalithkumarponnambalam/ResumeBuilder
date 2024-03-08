package com.resume.build.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.resume.build.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EducationDetailsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EducationDetails.class);
        EducationDetails educationDetails1 = new EducationDetails();
        educationDetails1.setId(1L);
        EducationDetails educationDetails2 = new EducationDetails();
        educationDetails2.setId(educationDetails1.getId());
        assertThat(educationDetails1).isEqualTo(educationDetails2);
        educationDetails2.setId(2L);
        assertThat(educationDetails1).isNotEqualTo(educationDetails2);
        educationDetails1.setId(null);
        assertThat(educationDetails1).isNotEqualTo(educationDetails2);
    }
}
