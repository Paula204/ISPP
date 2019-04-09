package com.ispp.thorneo.domain;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

/**
 * A PaypalCompletedPayments.
 */
@Entity
@Table(name = "paypal_completed_payments")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "paypalcompletedpayments")
public class PaypalCompletedPayments implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "jhi_date", nullable = false)
    private ZonedDateTime date;

    @NotNull
    @Column(name = "id_payment", nullable = false)
    private String idPayment;

    @NotNull
    @Column(name = "currency", nullable = false)
    private String currency;

    @NotNull
    @DecimalMin(value = "0")
    @Column(name = "amount", nullable = false)
    private Float amount;

    @NotNull
    @Column(name = "email", nullable = false)
    private String email;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Column(name = "status", nullable = false)
    private String status;

    @ManyToOne
    @JsonIgnoreProperties("payments")
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getDate() {
        return date;
    }

    public PaypalCompletedPayments date(ZonedDateTime date) {
        this.date = date;
        return this;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public String getIdPayment() {
        return idPayment;
    }

    public PaypalCompletedPayments idPayment(String idPayment) {
        this.idPayment = idPayment;
        return this;
    }

    public void setIdPayment(String idPayment) {
        this.idPayment = idPayment;
    }

    public String getCurrency() {
        return currency;
    }

    public PaypalCompletedPayments currency(String currency) {
        this.currency = currency;
        return this;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public Float getAmount() {
        return amount;
    }

    public PaypalCompletedPayments amount(Float amount) {
        this.amount = amount;
        return this;
    }

    public void setAmount(Float amount) {
        this.amount = amount;
    }

    public String getEmail() {
        return email;
    }

    public PaypalCompletedPayments email(String email) {
        this.email = email;
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public PaypalCompletedPayments name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getStatus() {
        return status;
    }

    public PaypalCompletedPayments status(String status) {
        this.status = status;
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public User getUser() {
        return user;
    }

    public PaypalCompletedPayments user(User user) {
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
        PaypalCompletedPayments paypalCompletedPayments = (PaypalCompletedPayments) o;
        if (paypalCompletedPayments.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), paypalCompletedPayments.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "PaypalCompletedPayments{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", idPayment='" + getIdPayment() + "'" +
            ", currency='" + getCurrency() + "'" +
            ", amount=" + getAmount() +
            ", email='" + getEmail() + "'" +
            ", name='" + getName() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
