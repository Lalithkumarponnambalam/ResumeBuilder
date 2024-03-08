package com.resume.build.domain;

import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;

/**
 * A EducationDetails.
 */
@Entity
@Table(name = "education_details")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class EducationDetails implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "school_name", nullable = false)
    private String schoolName;

    @Column(name = "city")
    private String city;

    @Column(name = "state")
    private String state;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "degree")
    private String degree;

    @Column(name = "fieldof_study")
    private String fieldofStudy;

    @Column(name = "graduation_date")
    private LocalDate graduationDate;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "education_summary")
    private String educationSummary;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public EducationDetails id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSchoolName() {
        return this.schoolName;
    }

    public EducationDetails schoolName(String schoolName) {
        this.setSchoolName(schoolName);
        return this;
    }

    public void setSchoolName(String schoolName) {
        this.schoolName = schoolName;
    }

    public String getCity() {
        return this.city;
    }

    public EducationDetails city(String city) {
        this.setCity(city);
        return this;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return this.state;
    }

    public EducationDetails state(String state) {
        this.setState(state);
        return this;
    }

    public void setState(String state) {
        this.state = state;
    }

    public LocalDate getStartDate() {
        return this.startDate;
    }

    public EducationDetails startDate(LocalDate startDate) {
        this.setStartDate(startDate);
        return this;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return this.endDate;
    }

    public EducationDetails endDate(LocalDate endDate) {
        this.setEndDate(endDate);
        return this;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getDegree() {
        return this.degree;
    }

    public EducationDetails degree(String degree) {
        this.setDegree(degree);
        return this;
    }

    public void setDegree(String degree) {
        this.degree = degree;
    }

    public String getFieldofStudy() {
        return this.fieldofStudy;
    }

    public EducationDetails fieldofStudy(String fieldofStudy) {
        this.setFieldofStudy(fieldofStudy);
        return this;
    }

    public void setFieldofStudy(String fieldofStudy) {
        this.fieldofStudy = fieldofStudy;
    }

    public LocalDate getGraduationDate() {
        return this.graduationDate;
    }

    public EducationDetails graduationDate(LocalDate graduationDate) {
        this.setGraduationDate(graduationDate);
        return this;
    }

    public void setGraduationDate(LocalDate graduationDate) {
        this.graduationDate = graduationDate;
    }

    public String getEducationSummary() {
        return this.educationSummary;
    }

    public EducationDetails educationSummary(String educationSummary) {
        this.setEducationSummary(educationSummary);
        return this;
    }

    public void setEducationSummary(String educationSummary) {
        this.educationSummary = educationSummary;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof EducationDetails)) {
            return false;
        }
        return id != null && id.equals(((EducationDetails) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "EducationDetails{" +
            "id=" + getId() +
            ", schoolName='" + getSchoolName() + "'" +
            ", city='" + getCity() + "'" +
            ", state='" + getState() + "'" +
            ", startDate='" + getStartDate() + "'" +
            ", endDate='" + getEndDate() + "'" +
            ", degree='" + getDegree() + "'" +
            ", fieldofStudy='" + getFieldofStudy() + "'" +
            ", graduationDate='" + getGraduationDate() + "'" +
            ", educationSummary='" + getEducationSummary() + "'" +
            "}";
    }
}
