package com.ispp.thorneo.repository;

import com.ispp.thorneo.domain.Promotion;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the Promotion entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {

    @Query("select promotion from Promotion promotion where promotion.user.login = ?#{principal.username}")
    List<Promotion> findByUserIsCurrentUser();

}
