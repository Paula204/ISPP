package com.ispp.thorneo.repository;

import com.ispp.thorneo.domain.Clasification;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Clasification entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ClasificationRepository extends JpaRepository<Clasification, Long> {

}
