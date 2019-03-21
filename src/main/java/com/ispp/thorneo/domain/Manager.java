package com.ispp.thorneo.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Manager.
 */
@Entity
@Table(name = "manager")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "manager")
public class Manager implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JsonIgnoreProperties("managers")
    private Free free;

    @ManyToOne
    @JsonIgnoreProperties("managers")
    private Premium premium;

    @ManyToOne
    @JsonIgnoreProperties("managers")
    private Sponsor sponsor;

    @OneToMany(mappedBy = "manager")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Tournament> tournaments = new HashSet<>();
    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Free getFree() {
        return free;
    }

    public Manager free(Free free) {
        this.free = free;
        return this;
    }

    public void setFree(Free free) {
        this.free = free;
    }

    public Premium getPremium() {
        return premium;
    }

    public Manager premium(Premium premium) {
        this.premium = premium;
        return this;
    }

    public void setPremium(Premium premium) {
        this.premium = premium;
    }

    public Sponsor getSponsor() {
        return sponsor;
    }

    public Manager sponsor(Sponsor sponsor) {
        this.sponsor = sponsor;
        return this;
    }

    public void setSponsor(Sponsor sponsor) {
        this.sponsor = sponsor;
    }

    public Set<Tournament> getTournaments() {
        return tournaments;
    }

    public Manager tournaments(Set<Tournament> tournaments) {
        this.tournaments = tournaments;
        return this;
    }

    public Manager addTournament(Tournament tournament) {
        this.tournaments.add(tournament);
        tournament.setManager(this);
        return this;
    }

    public Manager removeTournament(Tournament tournament) {
        this.tournaments.remove(tournament);
        tournament.setManager(null);
        return this;
    }

    public void setTournaments(Set<Tournament> tournaments) {
        this.tournaments = tournaments;
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
        Manager manager = (Manager) o;
        if (manager.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), manager.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Manager{" +
            "id=" + getId() +
            "}";
    }
}
