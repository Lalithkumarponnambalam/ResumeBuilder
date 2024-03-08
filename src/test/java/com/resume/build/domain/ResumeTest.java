package com.resume.build.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.resume.build.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ResumeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Resume.class);
        Resume resume1 = new Resume();
        resume1.setId(1L);
        Resume resume2 = new Resume();
        resume2.setId(resume1.getId());
        assertThat(resume1).isEqualTo(resume2);
        resume2.setId(2L);
        assertThat(resume1).isNotEqualTo(resume2);
        resume1.setId(null);
        assertThat(resume1).isNotEqualTo(resume2);
    }
}
