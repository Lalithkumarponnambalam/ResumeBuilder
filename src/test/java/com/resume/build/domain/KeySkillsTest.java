package com.resume.build.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.resume.build.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class KeySkillsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(KeySkills.class);
        KeySkills keySkills1 = new KeySkills();
        keySkills1.setId(1L);
        KeySkills keySkills2 = new KeySkills();
        keySkills2.setId(keySkills1.getId());
        assertThat(keySkills1).isEqualTo(keySkills2);
        keySkills2.setId(2L);
        assertThat(keySkills1).isNotEqualTo(keySkills2);
        keySkills1.setId(null);
        assertThat(keySkills1).isNotEqualTo(keySkills2);
    }
}
