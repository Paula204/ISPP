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
 * A Participation.
 */
@Entity
@Table(name = "participation")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "participation")
public class Participation implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "disqualify")
    private Boolean disqualify;

    @Min(0)
    @Column(name = "punctuation")
    private Integer punctuation;

    @ManyToOne
    @JsonIgnoreProperties("participations")
    private Tournament tournament;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("participations")
    private User user;

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

    public Participation disqualify(Boolean disqualify) {
        this.disqualify = disqualify;
        return this;
    }

    public void setDisqualify(Boolean disqualify) {
        this.disqualify = disqualify;
    }

    public Integer getPunctuation() {
        return punctuation;
    }

    public Participation punctuation(Integer punctuation) {
        this.punctuation = punctuation;
        return this;
    }

    public void setPunctuation(Integer punctuation) {
        this.punctuation = punctuation;
    }

    public Tournament getTournament() {
        return tournament;
    }

    public Participation tournament(Tournament tournament) {
        this.tournament = tournament;
        return this;
    }

    public void setTournament(Tournament tournament) {
        this.tournament = tournament;
    }

    public User getUser() {
        return user;
    }

    public Participation user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
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
        Participation participation = (Participation) o;
        if (participation.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), participation.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Participation{" +
            "id=" + getId() +
            ", disqualify='" + isDisqualify() + "'" +
            ", punctuation=" + getPunctuation() +
            "}";
    }
}
