package com.resume.build.domain;

import com.resume.build.domain.enumeration.LangOptions;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Languages.
 */
@Entity
@Table(name = "languages")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Languages implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "lang_option")
    private LangOptions langOption;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Languages id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LangOptions getLangOption() {
        return this.langOption;
    }

    public Languages langOption(LangOptions langOption) {
        this.setLangOption(langOption);
        return this;
    }

    public void setLangOption(LangOptions langOption) {
        this.langOption = langOption;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Languages)) {
            return false;
        }
        return id != null && id.equals(((Languages) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Languages{" +
            "id=" + getId() +
            ", langOption='" + getLangOption() + "'" +
            "}";
    }
}
