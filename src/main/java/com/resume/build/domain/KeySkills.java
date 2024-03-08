package com.resume.build.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;

/**
 * A KeySkills.
 */
@Entity
@Table(name = "key_skills")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class KeySkills implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "key_skills_summary")
    private String keySkillsSummary;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public KeySkills id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getKeySkillsSummary() {
        return this.keySkillsSummary;
    }

    public KeySkills keySkillsSummary(String keySkillsSummary) {
        this.setKeySkillsSummary(keySkillsSummary);
        return this;
    }

    public void setKeySkillsSummary(String keySkillsSummary) {
        this.keySkillsSummary = keySkillsSummary;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof KeySkills)) {
            return false;
        }
        return id != null && id.equals(((KeySkills) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "KeySkills{" +
            "id=" + getId() +
            ", keySkillsSummary='" + getKeySkillsSummary() + "'" +
            "}";
    }
}
