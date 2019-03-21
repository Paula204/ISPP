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

    @OneToMany(mappedBy = "premium")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Participant> participants = new HashSet<>();
    @OneToMany(mappedBy = "premium")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Manager> managers = new HashSet<>();
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

    public Premium participants(Set<Participant> participants) {
        this.participants = participants;
        return this;
    }

    public Premium addParticipant(Participant participant) {
        this.participants.add(participant);
        participant.setPremium(this);
        return this;
    }

    public Premium removeParticipant(Participant participant) {
        this.participants.remove(participant);
        participant.setPremium(null);
        return this;
    }

    public void setParticipants(Set<Participant> participants) {
        this.participants = participants;
    }

    public Set<Manager> getManagers() {
        return managers;
    }

    public Premium managers(Set<Manager> managers) {
        this.managers = managers;
        return this;
    }

    public Premium addManager(Manager manager) {
        this.managers.add(manager);
        manager.setPremium(this);
        return this;
    }

    public Premium removeManager(Manager manager) {
        this.managers.remove(manager);
        manager.setPremium(null);
        return this;
    }

    public void setManagers(Set<Manager> managers) {
        this.managers = managers;
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
