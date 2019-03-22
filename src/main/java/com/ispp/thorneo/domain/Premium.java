package com.ispp.thorneo.domain;


import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Premium.
 */
@Entity
@Table(name = "premium")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "premium")
public class Premium implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(unique = true)
    private Actor actor;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "premium_tournament",
               joinColumns = @JoinColumn(name = "premium_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "tournament_id", referencedColumnName = "id"))
    private Set<Tournament> tournaments = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Actor getActor() {
        return actor;
    }

    public Premium actor(Actor actor) {
        this.actor = actor;
        return this;
    }

    public void setActor(Actor actor) {
        this.actor = actor;
    }

    public Set<Tournament> getTournaments() {
        return tournaments;
    }

    public Premium tournaments(Set<Tournament> tournaments) {
        this.tournaments = tournaments;
        return this;
    }

    public Premium addTournament(Tournament tournament) {
        this.tournaments.add(tournament);
        tournament.getPremiums().add(this);
        return this;
    }

    public Premium removeTournament(Tournament tournament) {
        this.tournaments.remove(tournament);
        tournament.getPremiums().remove(this);
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
        Premium premium = (Premium) o;
        if (premium.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), premium.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Premium{" +
            "id=" + getId() +
            "}";
    }
}
