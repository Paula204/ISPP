package com.ispp.thorneo.repository;

import com.ispp.thorneo.domain.PaypalCompletedPayments;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the PaypalCompletedPayments entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PaypalCompletedPaymentsRepository extends JpaRepository<PaypalCompletedPayments, Long> {

    @Query("select paypal_completed_payments from PaypalCompletedPayments paypal_completed_payments where paypal_completed_payments.user.login = ?#{principal.username}")
    List<PaypalCompletedPayments> findByUserIsCurrentUser();

}
