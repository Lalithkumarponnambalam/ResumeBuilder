package com.resume.build.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.resume.build.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AreaofInterestTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AreaofInterest.class);
        AreaofInterest areaofInterest1 = new AreaofInterest();
        areaofInterest1.setId(1L);
        AreaofInterest areaofInterest2 = new AreaofInterest();
        areaofInterest2.setId(areaofInterest1.getId());
        assertThat(areaofInterest1).isEqualTo(areaofInterest2);
        areaofInterest2.setId(2L);
        assertThat(areaofInterest1).isNotEqualTo(areaofInterest2);
        areaofInterest1.setId(null);
        assertThat(areaofInterest1).isNotEqualTo(areaofInterest2);
    }
}
