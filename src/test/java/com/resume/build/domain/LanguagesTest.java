package com.resume.build.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.resume.build.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LanguagesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Languages.class);
        Languages languages1 = new Languages();
        languages1.setId(1L);
        Languages languages2 = new Languages();
        languages2.setId(languages1.getId());
        assertThat(languages1).isEqualTo(languages2);
        languages2.setId(2L);
        assertThat(languages1).isNotEqualTo(languages2);
        languages1.setId(null);
        assertThat(languages1).isNotEqualTo(languages2);
    }
}
