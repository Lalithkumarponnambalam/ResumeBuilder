package com.resume.build.domain;

import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;

/**
 * A CertificationDetails.
 */
@Entity
@Table(name = "certification_details")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class CertificationDetails implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "certificate_name")
    private String certificateName;

    @Column(name = "institution")
    private String institution;

    @Column(name = "certificate_date")
    private LocalDate certificateDate;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "certification_summary")
    private String certificationSummary;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public CertificationDetails id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCertificateName() {
        return this.certificateName;
    }

    public CertificationDetails certificateName(String certificateName) {
        this.setCertificateName(certificateName);
        return this;
    }

    public void setCertificateName(String certificateName) {
        this.certificateName = certificateName;
    }

    public String getInstitution() {
        return this.institution;
    }

    public CertificationDetails institution(String institution) {
        this.setInstitution(institution);
        return this;
    }

    public void setInstitution(String institution) {
        this.institution = institution;
    }

    public LocalDate getCertificateDate() {
        return this.certificateDate;
    }

    public CertificationDetails certificateDate(LocalDate certificateDate) {
        this.setCertificateDate(certificateDate);
        return this;
    }

    public void setCertificateDate(LocalDate certificateDate) {
        this.certificateDate = certificateDate;
    }

    public String getCertificationSummary() {
        return this.certificationSummary;
    }

    public CertificationDetails certificationSummary(String certificationSummary) {
        this.setCertificationSummary(certificationSummary);
        return this;
    }

    public void setCertificationSummary(String certificationSummary) {
        this.certificationSummary = certificationSummary;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CertificationDetails)) {
            return false;
        }
        return id != null && id.equals(((CertificationDetails) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CertificationDetails{" +
            "id=" + getId() +
            ", certificateName='" + getCertificateName() + "'" +
            ", institution='" + getInstitution() + "'" +
            ", certificateDate='" + getCertificateDate() + "'" +
            ", certificationSummary='" + getCertificationSummary() + "'" +
            "}";
    }
}
