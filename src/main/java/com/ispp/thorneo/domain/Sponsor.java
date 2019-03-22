package com.ispp.thorneo.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Sponsor.
 */
@Entity
@Table(name = "sponsor")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "sponsor")
public class Sponsor implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(unique = true)
    private Actor actor;

    @OneToMany(mappedBy = "sponsor")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Promotion> promotions = new HashSet<>();
    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "sponsor_tournament",
               joinColumns = @JoinColumn(name = "sponsor_id", referencedColumnName = "id"),
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

    public Sponsor actor(Actor actor) {
        this.actor = actor;
        return this;
    }

    public void setActor(Actor actor) {
        this.actor = actor;
    }

    public Set<Promotion> getPromotions() {
        return promotions;
    }

    public Sponsor promotions(Set<Promotion> promotions) {
        this.promotions = promotions;
        return this;
    }

    public Sponsor addPromotion(Promotion promotion) {
        this.promotions.add(promotion);
        promotion.setSponsor(this);
        return this;
    }

    public Sponsor removePromotion(Promotion promotion) {
        this.promotions.remove(promotion);
        promotion.setSponsor(null);
        return this;
    }

    public void setPromotions(Set<Promotion> promotions) {
        this.promotions = promotions;
    }

    public Set<Tournament> getTournaments() {
        return tournaments;
    }

    public Sponsor tournaments(Set<Tournament> tournaments) {
        this.tournaments = tournaments;
        return this;
    }

    public Sponsor addTournament(Tournament tournament) {
        this.tournaments.add(tournament);
        tournament.getSponsors().add(this);
        return this;
    }

    public Sponsor removeTournament(Tournament tournament) {
        this.tournaments.remove(tournament);
        tournament.getSponsors().remove(this);
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
        Sponsor sponsor = (Sponsor) o;
        if (sponsor.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), sponsor.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Sponsor{" +
            "id=" + getId() +
            "}";
    }
}
