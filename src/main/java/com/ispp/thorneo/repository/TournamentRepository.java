package com.ispp.thorneo.repository;

import com.ispp.thorneo.domain.Participation;
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

    @Query("select p.user.login from Tournament t join t.participations p where p.punctuation = ?1 and p.disqualify = false and t.id = ?2")
    String getWinner(Integer punctuation, Long id);

    @Query("select p from Tournament t join t.participations p where p.punctuation = (select max(participation.punctuation) from Participation participation) and p.disqualify = false and t.id = ?1")
    List<Participation> getParticipationWithMaxPunctuation(Long id);

    @Query("select p from Tournament t join t.participations p where p.punctuation = (select max(participation.punctuation) from Participation participation where p.id = participation.id and participation.punctuation > 10000) and p.disqualify = false and t.id = ?1")
    Participation findWinner(Long id);
}
