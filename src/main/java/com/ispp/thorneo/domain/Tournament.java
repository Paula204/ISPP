package com.ispp.thorneo.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

import com.ispp.thorneo.domain.enumeration.Type;

/**
 * A Tournament.
 */
@Entity
@Table(name = "tournament")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "tournament")
public class Tournament implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "title", nullable = false)
    private String title;

    @NotNull
    @Column(name = "description", nullable = false)
    private String description;

    @NotNull
    @Column(name = "meeting_date", nullable = false)
    private Instant meetingDate;

    @NotNull
    @Column(name = "meeting_point", nullable = false)
    private String meetingPoint;

    @NotNull
    @Column(name = "city", nullable = false)
    private String city;

    @Min(value = 0)
    @Column(name = "price")
    private Integer price;

    @Min(value = 0)
    @Column(name = "player_size")
    private Integer playerSize;

    @Column(name = "rewards")
    private String rewards;

    @NotNull
    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @Column(name = "latitude")
    private Long latitude;

    @Column(name = "longitude")
    private Long longitude;

    @Enumerated(EnumType.STRING)
    @Column(name = "jhi_type")
    private Type type;

    @Lob
    @Column(name = "imagen")
    private byte[] imagen;

    @Column(name = "imagen_content_type")
    private String imagenContentType;

    @OneToMany(mappedBy = "tournament")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Participation> participations = new HashSet<>();
    @ManyToOne
    @JsonIgnoreProperties("tournaments")
    private User user;

    @ManyToOne
    @JsonIgnoreProperties("tournaments")
    private Game game;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public Tournament title(String title) {
        this.title = title;
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public Tournament description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Instant getMeetingDate() {
        return meetingDate;
    }

    public Tournament meetingDate(Instant meetingDate) {
        this.meetingDate = meetingDate;
        return this;
    }

    public void setMeetingDate(Instant meetingDate) {
        this.meetingDate = meetingDate;
    }

    public String getMeetingPoint() {
        return meetingPoint;
    }

    public Tournament meetingPoint(String meetingPoint) {
        this.meetingPoint = meetingPoint;
        return this;
    }

    public void setMeetingPoint(String meetingPoint) {
        this.meetingPoint = meetingPoint;
    }

    public String getCity() {
        return city;
    }

    public Tournament city(String city) {
        this.city = city;
        return this;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Integer getPrice() {
        return price;
    }

    public Tournament price(Integer price) {
        this.price = price;
        return this;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public Integer getPlayerSize() {
        return playerSize;
    }

    public Tournament playerSize(Integer playerSize) {
        this.playerSize = playerSize;
        return this;
    }

    public void setPlayerSize(Integer playerSize) {
        this.playerSize = playerSize;
    }

    public String getRewards() {
        return rewards;
    }

    public Tournament rewards(String rewards) {
        this.rewards = rewards;
        return this;
    }

    public void setRewards(String rewards) {
        this.rewards = rewards;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public Tournament imageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
        return this;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Long getLatitude() {
        return latitude;
    }

    public Tournament latitude(Long latitude) {
        this.latitude = latitude;
        return this;
    }

    public void setLatitude(Long latitude) {
        this.latitude = latitude;
    }

    public Long getLongitude() {
        return longitude;
    }

    public Tournament longitude(Long longitude) {
        this.longitude = longitude;
        return this;
    }

    public void setLongitude(Long longitude) {
        this.longitude = longitude;
    }

    public Type getType() {
        return type;
    }

    public Tournament type(Type type) {
        this.type = type;
        return this;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public byte[] getImagen() {
        return imagen;
    }

    public Tournament imagen(byte[] imagen) {
        this.imagen = imagen;
        return this;
    }

    public void setImagen(byte[] imagen) {
        this.imagen = imagen;
    }

    public String getImagenContentType() {
        return imagenContentType;
    }

    public Tournament imagenContentType(String imagenContentType) {
        this.imagenContentType = imagenContentType;
        return this;
    }

    public void setImagenContentType(String imagenContentType) {
        this.imagenContentType = imagenContentType;
    }

    public Set<Participation> getParticipations() {
        return participations;
    }

    public Tournament participations(Set<Participation> participations) {
        this.participations = participations;
        return this;
    }

    public Tournament addParticipation(Participation participation) {
        this.participations.add(participation);
        participation.setTournament(this);
        return this;
    }

    public Tournament removeParticipation(Participation participation) {
        this.participations.remove(participation);
        participation.setTournament(null);
        return this;
    }

    public void setParticipations(Set<Participation> participations) {
        this.participations = participations;
    }

    public User getUser() {
        return user;
    }

    public Tournament user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Game getGame() {
        return game;
    }

    public Tournament game(Game game) {
        this.game = game;
        return this;
    }

    public void setGame(Game game) {
        this.game = game;
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
        Tournament tournament = (Tournament) o;
        if (tournament.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), tournament.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Tournament{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", description='" + getDescription() + "'" +
            ", meetingDate='" + getMeetingDate() + "'" +
            ", meetingPoint='" + getMeetingPoint() + "'" +
            ", city='" + getCity() + "'" +
            ", price=" + getPrice() +
            ", playerSize=" + getPlayerSize() +
            ", rewards='" + getRewards() + "'" +
            ", imageUrl='" + getImageUrl() + "'" +
            ", latitude=" + getLatitude() +
            ", longitude=" + getLongitude() +
            ", type='" + getType() + "'" +
            ", imagen='" + getImagen() + "'" +
            ", imagenContentType='" + getImagenContentType() + "'" +
            "}";
    }
}
