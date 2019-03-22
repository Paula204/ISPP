package com.ispp.thorneo.repository;

import com.ispp.thorneo.domain.Free;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the Free entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FreeRepository extends JpaRepository<Free, Long> {

    @Query(value = "select distinct free from Free free left join fetch free.tournaments",
        countQuery = "select count(distinct free) from Free free")
    Page<Free> findAllWithEagerRelationships(Pageable pageable);

    @Query(value = "select distinct free from Free free left join fetch free.tournaments")
    List<Free> findAllWithEagerRelationships();

    @Query("select free from Free free left join fetch free.tournaments where free.id =:id")
    Optional<Free> findOneWithEagerRelationships(@Param("id") Long id);

}
