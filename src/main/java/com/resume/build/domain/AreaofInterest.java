package com.resume.build.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;

/**
 * A AreaofInterest.
 */
@Entity
@Table(name = "areaof_interest")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class AreaofInterest implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "intrest_summary")
    private String intrestSummary;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public AreaofInterest id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIntrestSummary() {
        return this.intrestSummary;
    }

    public AreaofInterest intrestSummary(String intrestSummary) {
        this.setIntrestSummary(intrestSummary);
        return this;
    }

    public void setIntrestSummary(String intrestSummary) {
        this.intrestSummary = intrestSummary;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AreaofInterest)) {
            return false;
        }
        return id != null && id.equals(((AreaofInterest) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AreaofInterest{" +
            "id=" + getId() +
            ", intrestSummary='" + getIntrestSummary() + "'" +
            "}";
    }
}
