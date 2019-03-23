package com.ispp.thorneo.repository;

import com.ispp.thorneo.domain.Tournament;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the Tournament entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TournamentRepository extends JpaRepository<Tournament, Long> {

    @Query("select tournament from Tournament tournament where tournament.user.login = ?#{principal.username}")
    List<Tournament> findByUserIsCurrentUser();

    @Query("select tournament.id from Tournament tournament join tournament.participations p where p.user.login = ?#{principal.username}")
    Long findCurrentUserParticipation();

}
