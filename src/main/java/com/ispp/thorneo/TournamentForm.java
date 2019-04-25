package com.ispp.thorneo;

import com.ispp.thorneo.domain.Game;
import com.ispp.thorneo.domain.Participation;
import com.ispp.thorneo.domain.Tournament;
import com.ispp.thorneo.domain.User;
import com.ispp.thorneo.domain.enumeration.Type;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

public class TournamentForm {
    private Long id;
    private String title;
    private String description;
    private Instant meetingDate;
    private String meetingPoint;
    private String city;
    private Integer price;
    private Integer playerSize;
    private String rewards;
    private String imageUrl;
    private Long latitude;
    private Long longitude;
    private Type type;
    private Set<Participation> participations = new HashSet<>();
    private User user;
    private Game game;
    private String winner;
    private byte[] imagen;
    private String imagenContentType;
    private String state;

    public TournamentForm(Tournament tournament, String winner) {
        this.id = tournament.getId();
        this.title = tournament.getTitle();
        this.description = tournament.getDescription();
        this.meetingDate = tournament.getMeetingDate();
        this.meetingPoint = tournament.getMeetingPoint();
        this.city = tournament.getCity();
        this.price = tournament.getPrice();
        this.playerSize = tournament.getPlayerSize();
        this.rewards = tournament.getRewards();
        this.imageUrl = tournament.getImageUrl();
        this.latitude = tournament.getLatitude();
        this.longitude = tournament.getLongitude();
        this.type = tournament.getType();
        this.participations = tournament.getParticipations();
        this.user = tournament.getUser();
        this.game = tournament.getGame();
        this.winner = winner;
        this.imagen = tournament.getImagen();
        this.imagenContentType = tournament.getImagenContentType();
        this.state = tournament.getState();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Instant getMeetingDate() {
        return meetingDate;
    }

    public void setMeetingDate(Instant meetingDate) {
        this.meetingDate = meetingDate;
    }

    public String getMeetingPoint() {
        return meetingPoint;
    }

    public void setMeetingPoint(String meetingPoint) {
        this.meetingPoint = meetingPoint;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public Integer getPlayerSize() {
        return playerSize;
    }

    public void setPlayerSize(Integer playerSize) {
        this.playerSize = playerSize;
    }

    public String getRewards() {
        return rewards;
    }

    public void setRewards(String rewards) {
        this.rewards = rewards;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Long getLatitude() {
        return latitude;
    }

    public void setLatitude(Long latitude) {
        this.latitude = latitude;
    }

    public Long getLongitude() {
        return longitude;
    }

    public void setLongitude(Long longitude) {
        this.longitude = longitude;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public Set<Participation> getParticipations() {
        return participations;
    }

    public void setParticipations(Set<Participation> participations) {
        this.participations = participations;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Game getGame() {
        return game;
    }

    public void setGame(Game game) {
        this.game = game;
    }

    public String getWinner() {
        return winner;
    }

    public void setWinner(String winner) {
        this.winner = winner;
    }

    public byte[] getImagen() {
        return imagen;
    }

    public void setImagen(byte[] imagen) {
        this.imagen = imagen;
    }

    public String getImagenContentType() {
        return imagenContentType;
    }

    public void setImagenContentType(String imagenContentType) {
        this.imagenContentType = imagenContentType;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }
}
