package com.ispp.thorneo.service;

import com.ispp.thorneo.domain.Promotion;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing Promotion.
 */
public interface PromotionService {

    /**
     * Save a promotion.
     *
     * @param promotion the entity to save
     * @return the persisted entity
     */
    Promotion save(Promotion promotion);

    /**
     * Get all the promotions.
     *
     * @return the list of entities
     */
    List<Promotion> findAll();


    /**
     * Get the "id" promotion.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Optional<Promotion> findOne(Long id);

    /**
     * Delete the "id" promotion.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the promotion corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @return the list of entities
     */
    List<Promotion> search(String query);
}
