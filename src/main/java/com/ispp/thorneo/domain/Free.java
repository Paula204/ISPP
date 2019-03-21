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

    @OneToMany(mappedBy = "free")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Participant> participants = new HashSet<>();
    @OneToMany(mappedBy = "free")
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

    public Free participants(Set<Participant> participants) {
        this.participants = participants;
        return this;
    }

    public Free addParticipant(Participant participant) {
        this.participants.add(participant);
        participant.setFree(this);
        return this;
    }

    public Free removeParticipant(Participant participant) {
        this.participants.remove(participant);
        participant.setFree(null);
        return this;
    }

    public void setParticipants(Set<Participant> participants) {
        this.participants = participants;
    }

    public Set<Manager> getManagers() {
        return managers;
    }

    public Free managers(Set<Manager> managers) {
        this.managers = managers;
        return this;
    }

    public Free addManager(Manager manager) {
        this.managers.add(manager);
        manager.setFree(this);
        return this;
    }

    public Free removeManager(Manager manager) {
        this.managers.remove(manager);
        manager.setFree(null);
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
