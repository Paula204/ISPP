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

    @OneToMany(mappedBy = "sponsor")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Participant> participants = new HashSet<>();
    @OneToMany(mappedBy = "sponsor")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Manager> managers = new HashSet<>();
    @OneToMany(mappedBy = "sponsor")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Promotion> promotions = new HashSet<>();
    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Set<Participant> getParticipants() {
        return participants;
    }

    public Sponsor participants(Set<Participant> participants) {
        this.participants = participants;
        return this;
    }

    public Sponsor addParticipant(Participant participant) {
        this.participants.add(participant);
        participant.setSponsor(this);
        return this;
    }

    public Sponsor removeParticipant(Participant participant) {
        this.participants.remove(participant);
        participant.setSponsor(null);
        return this;
    }

    public void setParticipants(Set<Participant> participants) {
        this.participants = participants;
    }

    public Set<Manager> getManagers() {
        return managers;
    }

    public Sponsor managers(Set<Manager> managers) {
        this.managers = managers;
        return this;
    }

    public Sponsor addManager(Manager manager) {
        this.managers.add(manager);
        manager.setSponsor(this);
        return this;
    }

    public Sponsor removeManager(Manager manager) {
        this.managers.remove(manager);
        manager.setSponsor(null);
        return this;
    }

    public void setManagers(Set<Manager> managers) {
        this.managers = managers;
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
