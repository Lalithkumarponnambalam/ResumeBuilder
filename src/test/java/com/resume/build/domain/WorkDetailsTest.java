package com.resume.build.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.resume.build.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class WorkDetailsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(WorkDetails.class);
        WorkDetails workDetails1 = new WorkDetails();
        workDetails1.setId(1L);
        WorkDetails workDetails2 = new WorkDetails();
        workDetails2.setId(workDetails1.getId());
        assertThat(workDetails1).isEqualTo(workDetails2);
        workDetails2.setId(2L);
        assertThat(workDetails1).isNotEqualTo(workDetails2);
        workDetails1.setId(null);
        assertThat(workDetails1).isNotEqualTo(workDetails2);
    }
}
