package com.resume.build.domain;

import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;

/**
 * A WorkDetails.
 */
@Entity
@Table(name = "work_details")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class WorkDetails implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "job_title", nullable = false)
    private String jobTitle;

    @Column(name = "position")
    private String position;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "city")
    private String city;

    @Column(name = "state")
    private String state;

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

    public WorkDetails id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getJobTitle() {
        return this.jobTitle;
    }

    public WorkDetails jobTitle(String jobTitle) {
        this.setJobTitle(jobTitle);
        return this;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getPosition() {
        return this.position;
    }

    public WorkDetails position(String position) {
        this.setPosition(position);
        return this;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getCompanyName() {
        return this.companyName;
    }

    public WorkDetails companyName(String companyName) {
        this.setCompanyName(companyName);
        return this;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getCity() {
        return this.city;
    }

    public WorkDetails city(String city) {
        this.setCity(city);
        return this;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return this.state;
    }

    public WorkDetails state(String state) {
        this.setState(state);
        return this;
    }

    public void setState(String state) {
        this.state = state;
    }

    public LocalDate getStartDate() {
        return this.startDate;
    }

    public WorkDetails startDate(LocalDate startDate) {
        this.setStartDate(startDate);
        return this;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return this.endDate;
    }

    public WorkDetails endDate(LocalDate endDate) {
        this.setEndDate(endDate);
        return this;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getWorkSummary() {
        return this.workSummary;
    }

    public WorkDetails workSummary(String workSummary) {
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
        if (!(o instanceof WorkDetails)) {
            return false;
        }
        return id != null && id.equals(((WorkDetails) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "WorkDetails{" +
            "id=" + getId() +
            ", jobTitle='" + getJobTitle() + "'" +
            ", position='" + getPosition() + "'" +
            ", companyName='" + getCompanyName() + "'" +
            ", city='" + getCity() + "'" +
            ", state='" + getState() + "'" +
            ", startDate='" + getStartDate() + "'" +
            ", endDate='" + getEndDate() + "'" +
            ", workSummary='" + getWorkSummary() + "'" +
            "}";
    }
}
