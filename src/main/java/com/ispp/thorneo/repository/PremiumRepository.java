package com.ispp.thorneo.repository;

import com.ispp.thorneo.domain.Premium;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Premium entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PremiumRepository extends JpaRepository<Premium, Long> {

}
