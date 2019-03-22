package com.ispp.thorneo.domain;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.util.Objects;

/**
 * A Sponsorship.
 */
@Entity
@Table(name = "sponsorship")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "sponsorship")
public class Sponsorship implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "banner", nullable = false)
    private String banner;

    @NotNull
    @Column(name = "target_url", nullable = false)
    private String targetUrl;

    @ManyToOne
    @JsonIgnoreProperties("sponsorships")
    private Sponsor sponsor;

    @ManyToOne
    @JsonIgnoreProperties("sponsorships")
    private Tournament tournament;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBanner() {
        return banner;
    }

    public Sponsorship banner(String banner) {
        this.banner = banner;
        return this;
    }

    public void setBanner(String banner) {
        this.banner = banner;
    }

    public String getTargetUrl() {
        return targetUrl;
    }

    public Sponsorship targetUrl(String targetUrl) {
        this.targetUrl = targetUrl;
        return this;
    }

    public void setTargetUrl(String targetUrl) {
        this.targetUrl = targetUrl;
    }

    public Sponsor getSponsor() {
        return sponsor;
    }

    public Sponsorship sponsor(Sponsor sponsor) {
        this.sponsor = sponsor;
        return this;
    }

    public void setSponsor(Sponsor sponsor) {
        this.sponsor = sponsor;
    }

    public Tournament getTournament() {
        return tournament;
    }

    public Sponsorship tournament(Tournament tournament) {
        this.tournament = tournament;
        return this;
    }

    public void setTournament(Tournament tournament) {
        this.tournament = tournament;
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
        Sponsorship sponsorship = (Sponsorship) o;
        if (sponsorship.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), sponsorship.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Sponsorship{" +
            "id=" + getId() +
            ", banner='" + getBanner() + "'" +
            ", targetUrl='" + getTargetUrl() + "'" +
            "}";
    }
}
