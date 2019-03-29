package com.ispp.thorneo.repository;

import com.ispp.thorneo.domain.Sponsorship;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the Sponsorship entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SponsorshipRepository extends JpaRepository<Sponsorship, Long> {

    @Query("select sponsorship from Sponsorship sponsorship where sponsorship.user.login = ?#{principal.username}")
    List<Sponsorship> findByUserIsCurrentUser();

}
