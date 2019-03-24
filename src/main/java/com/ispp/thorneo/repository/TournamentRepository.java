package com.ispp.thorneo.repository;

import com.ispp.thorneo.domain.Tournament;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;


/**
 * Spring Data  repository for the Tournament entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TournamentRepository extends JpaRepository<Tournament, Long> {

    @Query("select tournament from Tournament tournament where tournament.user.login = ?#{principal.username}")
    List<Tournament> findByUserIsCurrentUser();

    @Query("select tournament.id from Tournament tournament join tournament.participations p where p.user.login = ?#{principal.username} and tournament.id = ?1")
    Long findCurrentUserParticipation(Long tournamentId);

    @Query("select tournament, count(p) from Tournament tournament join tournament.participations p where tournament.id = ?1")
    Object getAllParticipantsByTournament(Long tournamentId);

}
