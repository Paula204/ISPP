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
 * A Free.
 */
@Entity
@Table(name = "free")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "free")
public class Free implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(unique = true)
    private Actor actor;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "free_tournament",
               joinColumns = @JoinColumn(name = "free_id", referencedColumnName = "id"),
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

    public Free actor(Actor actor) {
        this.actor = actor;
        return this;
    }

    public void setActor(Actor actor) {
        this.actor = actor;
    }

    public Set<Tournament> getTournaments() {
        return tournaments;
    }

    public Free tournaments(Set<Tournament> tournaments) {
        this.tournaments = tournaments;
        return this;
    }

    public Free addTournament(Tournament tournament) {
        this.tournaments.add(tournament);
        tournament.getFrees().add(this);
        return this;
    }

    public Free removeTournament(Tournament tournament) {
        this.tournaments.remove(tournament);
        tournament.getFrees().remove(this);
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
        Free free = (Free) o;
        if (free.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), free.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Free{" +
            "id=" + getId() +
            "}";
    }
}
