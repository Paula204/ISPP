package com.ispp.thorneo.repository;

import com.ispp.thorneo.domain.Premium;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the Premium entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PremiumRepository extends JpaRepository<Premium, Long> {

    @Query(value = "select distinct premium from Premium premium left join fetch premium.tournaments",
        countQuery = "select count(distinct premium) from Premium premium")
    Page<Premium> findAllWithEagerRelationships(Pageable pageable);

    @Query(value = "select distinct premium from Premium premium left join fetch premium.tournaments")
    List<Premium> findAllWithEagerRelationships();

    @Query("select premium from Premium premium left join fetch premium.tournaments where premium.id =:id")
    Optional<Premium> findOneWithEagerRelationships(@Param("id") Long id);

}
