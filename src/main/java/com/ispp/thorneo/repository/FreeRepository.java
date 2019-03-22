package com.ispp.thorneo.repository;

import com.ispp.thorneo.domain.Free;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Free entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FreeRepository extends JpaRepository<Free, Long> {

}
