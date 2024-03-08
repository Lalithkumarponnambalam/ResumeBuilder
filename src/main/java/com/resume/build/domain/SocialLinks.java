package com.resume.build.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A SocialLinks.
 */
@Entity
@Table(name = "social_links")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class SocialLinks implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "lable")
    private String lable;

    @Column(name = "link")
    private String link;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public SocialLinks id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLable() {
        return this.lable;
    }

    public SocialLinks lable(String lable) {
        this.setLable(lable);
        return this;
    }

    public void setLable(String lable) {
        this.lable = lable;
    }

    public String getLink() {
        return this.link;
    }

    public SocialLinks link(String link) {
        this.setLink(link);
        return this;
    }

    public void setLink(String link) {
        this.link = link;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SocialLinks)) {
            return false;
        }
        return id != null && id.equals(((SocialLinks) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SocialLinks{" +
            "id=" + getId() +
            ", lable='" + getLable() + "'" +
            ", link='" + getLink() + "'" +
            "}";
    }
}
