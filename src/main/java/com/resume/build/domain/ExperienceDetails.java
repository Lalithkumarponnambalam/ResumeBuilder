package com.resume.build.domain;

import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;

/**
 * A ExperienceDetails.
 */
@Entity
@Table(name = "experience_details")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ExperienceDetails implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "position_title")
    private String positionTitle;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "work_summary")
    private String workSummary;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ExperienceDetails id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPositionTitle() {
        return this.positionTitle;
    }

    public ExperienceDetails positionTitle(String positionTitle) {
        this.setPositionTitle(positionTitle);
        return this;
    }

    public void setPositionTitle(String positionTitle) {
        this.positionTitle = positionTitle;
    }

    public String getCompanyName() {
        return this.companyName;
    }

    public ExperienceDetails companyName(String companyName) {
        this.setCompanyName(companyName);
        return this;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public LocalDate getStartDate() {
        return this.startDate;
    }

    public ExperienceDetails startDate(LocalDate startDate) {
        this.setStartDate(startDate);
        return this;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return this.endDate;
    }

    public ExperienceDetails endDate(LocalDate endDate) {
        this.setEndDate(endDate);
        return this;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getWorkSummary() {
        return this.workSummary;
    }

    public ExperienceDetails workSummary(String workSummary) {
        this.setWorkSummary(workSummary);
        return this;
    }

    public void setWorkSummary(String workSummary) {
        this.workSummary = workSummary;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ExperienceDetails)) {
            return false;
        }
        return id != null && id.equals(((ExperienceDetails) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ExperienceDetails{" +
            "id=" + getId() +
            ", positionTitle='" + getPositionTitle() + "'" +
            ", companyName='" + getCompanyName() + "'" +
            ", startDate='" + getStartDate() + "'" +
            ", endDate='" + getEndDate() + "'" +
            ", workSummary='" + getWorkSummary() + "'" +
            "}";
    }
}
