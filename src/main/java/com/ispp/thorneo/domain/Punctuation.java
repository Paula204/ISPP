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
 * A Punctuation.
 */
@Entity
@Table(name = "punctuation")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "punctuation")
public class Punctuation implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Min(value = 0)
    @Column(name = "jhi_index", nullable = false)
    private Integer index;

    @NotNull
    @Min(value = 0)
    @Column(name = "points", nullable = false)
    private Integer points;

    @NotNull
    @Min(value = 0)
    @Column(name = "round", nullable = false)
    private Integer round;

    @ManyToOne(optional = false)
    @NotNull
    private Tournament tournament;

    @ManyToOne(optional = false)
    @NotNull
    private Participation participation;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getIndex() {
        return index;
    }

    public Punctuation index(Integer index) {
        this.index = index;
        return this;
    }

    public void setIndex(Integer index) {
        this.index = index;
    }

    public Integer getPoints() {
        return points;
    }

    public Punctuation points(Integer points) {
        this.points = points;
        return this;
    }

    public void setPoints(Integer points) {
        this.points = points;
    }

    public Integer getRound() {
        return round;
    }

    public Punctuation round(Integer round) {
        this.round = round;
        return this;
    }

    public void setRound(Integer round) {
        this.round = round;
    }

    public Tournament getTournament() {
        return tournament;
    }

    public Punctuation tournament(Tournament tournament) {
        this.tournament = tournament;
        return this;
    }

    public void setTournament(Tournament tournament) {
        this.tournament = tournament;
    }

    public Participation getParticipation() {
        return participation;
    }

    public Punctuation participation(Participation participation) {
        this.participation = participation;
        return this;
    }

    public void setParticipation(Participation participation) {
        this.participation = participation;
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
        Punctuation punctuation = (Punctuation) o;
        if (punctuation.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), punctuation.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Punctuation{" +
            "id=" + getId() +
            ", index=" + getIndex() +
            ", points=" + getPoints() +
            ", round=" + getRound() +
            "}";
    }
}
