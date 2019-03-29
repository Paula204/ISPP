package com.ispp.thorneo.repository;

import com.ispp.thorneo.domain.Participation;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the Participation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ParticipationRepository extends JpaRepository<Participation, Long> {

    @Query("select participation from Participation participation where participation.user.login = ?#{principal.username}")
    List<Participation> findByUserIsCurrentUser();
}
