package com.ispp.thorneo.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.util.Objects;

/**
 * A Participant.
 */
@Entity
@Table(name = "participant")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "participant")
public class Participant implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "disqualify", nullable = false)
    private Boolean disqualify;

    @Min(value = 0)
    @Column(name = "jhi_rank")
    private Integer rank;

    @OneToOne(mappedBy = "participant")
    @JsonIgnore
    private Clasification clasification;

    @ManyToOne
    @JsonIgnoreProperties("participants")
    private Free free;

    @ManyToOne
    @JsonIgnoreProperties("participants")
    private Premium premium;

    @ManyToOne
    @JsonIgnoreProperties("participants")
    private Sponsor sponsor;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean isDisqualify() {
        return disqualify;
    }

    public Participant disqualify(Boolean disqualify) {
        this.disqualify = disqualify;
        return this;
    }

    public void setDisqualify(Boolean disqualify) {
        this.disqualify = disqualify;
    }

    public Integer getRank() {
        return rank;
    }

    public Participant rank(Integer rank) {
        this.rank = rank;
        return this;
    }

    public void setRank(Integer rank) {
        this.rank = rank;
    }

    public Clasification getClasification() {
        return clasification;
    }

    public Participant clasification(Clasification clasification) {
        this.clasification = clasification;
        return this;
    }

    public void setClasification(Clasification clasification) {
        this.clasification = clasification;
    }

    public Free getFree() {
        return free;
    }

    public Participant free(Free free) {
        this.free = free;
        return this;
    }

    public void setFree(Free free) {
        this.free = free;
    }

    public Premium getPremium() {
        return premium;
    }

    public Participant premium(Premium premium) {
        this.premium = premium;
        return this;
    }

    public void setPremium(Premium premium) {
        this.premium = premium;
    }

    public Sponsor getSponsor() {
        return sponsor;
    }

    public Participant sponsor(Sponsor sponsor) {
        this.sponsor = sponsor;
        return this;
    }

    public void setSponsor(Sponsor sponsor) {
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
        Participant participant = (Participant) o;
        if (participant.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), participant.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Participant{" +
            "id=" + getId() +
            ", disqualify='" + isDisqualify() + "'" +
            ", rank=" + getRank() +
            "}";
    }
}
