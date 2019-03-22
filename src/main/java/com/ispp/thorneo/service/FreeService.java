package com.ispp.thorneo.service;

import com.ispp.thorneo.domain.Free;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing Free.
 */
public interface FreeService {

    /**
     * Save a free.
     *
     * @param free the entity to save
     * @return the persisted entity
     */
    Free save(Free free);

    /**
     * Get all the frees.
     *
     * @return the list of entities
     */
    List<Free> findAll();

    /**
     * Get all the Free with eager load of many-to-many relationships.
     *
     * @return the list of entities
     */
    Page<Free> findAllWithEagerRelationships(Pageable pageable);
    
    /**
     * Get the "id" free.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Optional<Free> findOne(Long id);

    /**
     * Delete the "id" free.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the free corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @return the list of entities
     */
    List<Free> search(String query);
}
