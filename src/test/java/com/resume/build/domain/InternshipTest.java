package com.resume.build.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.resume.build.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class InternshipTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Internship.class);
        Internship internship1 = new Internship();
        internship1.setId(1L);
        Internship internship2 = new Internship();
        internship2.setId(internship1.getId());
        assertThat(internship1).isEqualTo(internship2);
        internship2.setId(2L);
        assertThat(internship1).isNotEqualTo(internship2);
        internship1.setId(null);
        assertThat(internship1).isNotEqualTo(internship2);
    }
}
