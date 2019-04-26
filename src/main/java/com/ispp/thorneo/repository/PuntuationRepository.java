package com.ispp.thorneo.repository;

import com.ispp.thorneo.domain.Puntuation;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Puntuation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PuntuationRepository extends JpaRepository<Puntuation, Long> {

}
