package com.resume.build.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;

/**
 * A Resume.
 */
@Entity
@Table(name = "resume")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Resume implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "resume_summary")
    private String resumeSummary;

    @Column(name = "job_title")
    private String jobTitle;

    @OneToOne
    @JoinColumn(unique = true)
    private PersonalDetails personalDetails;

    @OneToOne
    @JoinColumn(unique = true)
    private WorkDetails workDetails;

    @OneToOne
    @JoinColumn(unique = true)
    private ExperienceDetails experienceDetails;

    @OneToOne
    @JoinColumn(unique = true)
    private EducationDetails educationDetails;

    @OneToOne
    @JoinColumn(unique = true)
    private CertificationDetails certificationDetails;

    @OneToOne
    @JoinColumn(unique = true)
    private Languages languages;

    @OneToOne
    @JoinColumn(unique = true)
    private KeySkills keySkills;

    @OneToOne
    @JoinColumn(unique = true)
    private AreaofInterest areaofInterest;

    @OneToOne
    @JoinColumn(unique = true)
    private SocialLinks socialLinks;

    @OneToOne
    @JoinColumn(unique = true)
    private Internship internship;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Resume id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getResumeSummary() {
        return this.resumeSummary;
    }

    public Resume resumeSummary(String resumeSummary) {
        this.setResumeSummary(resumeSummary);
        return this;
    }

    public void setResumeSummary(String resumeSummary) {
        this.resumeSummary = resumeSummary;
    }

    public String getJobTitle() {
        return this.jobTitle;
    }

    public Resume jobTitle(String jobTitle) {
        this.setJobTitle(jobTitle);
        return this;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public PersonalDetails getPersonalDetails() {
        return this.personalDetails;
    }

    public void setPersonalDetails(PersonalDetails personalDetails) {
        this.personalDetails = personalDetails;
    }

    public Resume personalDetails(PersonalDetails personalDetails) {
        this.setPersonalDetails(personalDetails);
        return this;
    }

    public WorkDetails getWorkDetails() {
        return this.workDetails;
    }

    public void setWorkDetails(WorkDetails workDetails) {
        this.workDetails = workDetails;
    }

    public Resume workDetails(WorkDetails workDetails) {
        this.setWorkDetails(workDetails);
        return this;
    }

    public ExperienceDetails getExperienceDetails() {
        return this.experienceDetails;
    }

    public void setExperienceDetails(ExperienceDetails experienceDetails) {
        this.experienceDetails = experienceDetails;
    }

    public Resume experienceDetails(ExperienceDetails experienceDetails) {
        this.setExperienceDetails(experienceDetails);
        return this;
    }

    public EducationDetails getEducationDetails() {
        return this.educationDetails;
    }

    public void setEducationDetails(EducationDetails educationDetails) {
        this.educationDetails = educationDetails;
    }

    public Resume educationDetails(EducationDetails educationDetails) {
        this.setEducationDetails(educationDetails);
        return this;
    }

    public CertificationDetails getCertificationDetails() {
        return this.certificationDetails;
    }

    public void setCertificationDetails(CertificationDetails certificationDetails) {
        this.certificationDetails = certificationDetails;
    }

    public Resume certificationDetails(CertificationDetails certificationDetails) {
        this.setCertificationDetails(certificationDetails);
        return this;
    }

    public Languages getLanguages() {
        return this.languages;
    }

    public void setLanguages(Languages languages) {
        this.languages = languages;
    }

    public Resume languages(Languages languages) {
        this.setLanguages(languages);
        return this;
    }

    public KeySkills getKeySkills() {
        return this.keySkills;
    }

    public void setKeySkills(KeySkills keySkills) {
        this.keySkills = keySkills;
    }

    public Resume keySkills(KeySkills keySkills) {
        this.setKeySkills(keySkills);
        return this;
    }

    public AreaofInterest getAreaofInterest() {
        return this.areaofInterest;
    }

    public void setAreaofInterest(AreaofInterest areaofInterest) {
        this.areaofInterest = areaofInterest;
    }

    public Resume areaofInterest(AreaofInterest areaofInterest) {
        this.setAreaofInterest(areaofInterest);
        return this;
    }

    public SocialLinks getSocialLinks() {
        return this.socialLinks;
    }

    public void setSocialLinks(SocialLinks socialLinks) {
        this.socialLinks = socialLinks;
    }

    public Resume socialLinks(SocialLinks socialLinks) {
        this.setSocialLinks(socialLinks);
        return this;
    }

    public Internship getInternship() {
        return this.internship;
    }

    public void setInternship(Internship internship) {
        this.internship = internship;
    }

    public Resume internship(Internship internship) {
        this.setInternship(internship);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Resume)) {
            return false;
        }
        return id != null && id.equals(((Resume) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Resume{" +
            "id=" + getId() +
            ", resumeSummary='" + getResumeSummary() + "'" +
            ", jobTitle='" + getJobTitle() + "'" +
            "}";
    }
}
