package com.resume.build.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.resume.build.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CertificationDetailsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CertificationDetails.class);
        CertificationDetails certificationDetails1 = new CertificationDetails();
        certificationDetails1.setId(1L);
        CertificationDetails certificationDetails2 = new CertificationDetails();
        certificationDetails2.setId(certificationDetails1.getId());
        assertThat(certificationDetails1).isEqualTo(certificationDetails2);
        certificationDetails2.setId(2L);
        assertThat(certificationDetails1).isNotEqualTo(certificationDetails2);
        certificationDetails1.setId(null);
        assertThat(certificationDetails1).isNotEqualTo(certificationDetails2);
    }
}
