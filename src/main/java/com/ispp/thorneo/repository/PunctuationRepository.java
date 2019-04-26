package com.ispp.thorneo.repository;

import com.ispp.thorneo.domain.Punctuation;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Punctuation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PunctuationRepository extends JpaRepository<Punctuation, Long> {

}
