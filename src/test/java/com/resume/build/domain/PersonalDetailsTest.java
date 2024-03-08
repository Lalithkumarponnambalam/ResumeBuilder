package com.resume.build.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.resume.build.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PersonalDetailsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PersonalDetails.class);
        PersonalDetails personalDetails1 = new PersonalDetails();
        personalDetails1.setId(1L);
        PersonalDetails personalDetails2 = new PersonalDetails();
        personalDetails2.setId(personalDetails1.getId());
        assertThat(personalDetails1).isEqualTo(personalDetails2);
        personalDetails2.setId(2L);
        assertThat(personalDetails1).isNotEqualTo(personalDetails2);
        personalDetails1.setId(null);
        assertThat(personalDetails1).isNotEqualTo(personalDetails2);
    }
}
