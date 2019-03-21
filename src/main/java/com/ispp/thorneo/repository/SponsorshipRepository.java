package com.ispp.thorneo.repository;

import com.ispp.thorneo.domain.Sponsorship;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Sponsorship entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SponsorshipRepository extends JpaRepository<Sponsorship, Long> {

}
