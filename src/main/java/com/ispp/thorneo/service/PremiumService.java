package com.ispp.thorneo.service;

import com.ispp.thorneo.domain.Premium;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing Premium.
 */
public interface PremiumService {

    /**
     * Save a premium.
     *
     * @param premium the entity to save
     * @return the persisted entity
     */
    Premium save(Premium premium);

    /**
     * Get all the premiums.
     *
     * @return the list of entities
     */
    List<Premium> findAll();

    /**
     * Get all the Premium with eager load of many-to-many relationships.
     *
     * @return the list of entities
     */
    Page<Premium> findAllWithEagerRelationships(Pageable pageable);
    
    /**
     * Get the "id" premium.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Optional<Premium> findOne(Long id);

    /**
     * Delete the "id" premium.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the premium corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @return the list of entities
     */
    List<Premium> search(String query);
}
