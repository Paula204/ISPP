package com.ispp.thorneo.repository;

import com.ispp.thorneo.domain.Sponsor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the Sponsor entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SponsorRepository extends JpaRepository<Sponsor, Long> {

    @Query(value = "select distinct sponsor from Sponsor sponsor left join fetch sponsor.tournaments",
        countQuery = "select count(distinct sponsor) from Sponsor sponsor")
    Page<Sponsor> findAllWithEagerRelationships(Pageable pageable);

    @Query(value = "select distinct sponsor from Sponsor sponsor left join fetch sponsor.tournaments")
    List<Sponsor> findAllWithEagerRelationships();

    @Query("select sponsor from Sponsor sponsor left join fetch sponsor.tournaments where sponsor.id =:id")
    Optional<Sponsor> findOneWithEagerRelationships(@Param("id") Long id);

}
