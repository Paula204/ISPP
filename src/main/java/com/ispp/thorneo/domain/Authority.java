package com.ispp.thorneo.domain;


import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.util.Objects;

/**
 * A Authority.
 */
@Entity
@Table(name = "authority")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "authority")
public class Authority implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "free")
    private String free;

    @Column(name = "premium")
    private String premium;

    @Column(name = "sponsor")
    private String sponsor;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFree() {
        return free;
    }

    public Authority free(String free) {
        this.free = free;
        return this;
    }

    public void setFree(String free) {
        this.free = free;
    }

    public String getPremium() {
        return premium;
    }

    public Authority premium(String premium) {
        this.premium = premium;
        return this;
    }

    public void setPremium(String premium) {
        this.premium = premium;
    }

    public String getSponsor() {
        return sponsor;
    }

    public Authority sponsor(String sponsor) {
        this.sponsor = sponsor;
        return this;
    }

    public void setSponsor(String sponsor) {
        this.sponsor = sponsor;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Authority authority = (Authority) o;
        if (authority.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), authority.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Authority{" +
            "id=" + getId() +
            ", free='" + getFree() + "'" +
            ", premium='" + getPremium() + "'" +
            ", sponsor='" + getSponsor() + "'" +
            "}";
    }
}
