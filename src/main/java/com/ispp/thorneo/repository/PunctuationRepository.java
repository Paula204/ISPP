package com.ispp.thorneo.repository;

import java.util.List;

import com.ispp.thorneo.domain.Punctuation;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Punctuation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PunctuationRepository extends JpaRepository<Punctuation, Long> {

    @Query("select p from Punctuation p where p.tournament.id = ?1")
    List<Punctuation> getPunctuationsByTournament(Long tournamentId);

    @Query("select max(p.round) from Punctuation p where p.tournament.id = ?1")
    Integer getMaxRoundTournament(Long tournamentId);

    @Query("select p from Punctuation p where p.round = ?1 and p.tournament.id = ?2")
    List<Punctuation> getPuntuationsByRoundAndTournament(Integer round, Long tournamentId);
}
