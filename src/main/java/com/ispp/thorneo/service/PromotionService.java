package com.ispp.thorneo.service;

import com.ispp.thorneo.domain.Promotion;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

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
     * @param pageable the pagination information
     * @return the list of entities
     */
    Page<Promotion> findAll(Pageable pageable);


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
     * @param pageable the pagination information
     * @return the list of entities
     */
    Page<Promotion> search(String query, Pageable pageable);

    /**
     * Set user and seve promotion
     */
    Promotion savePromotion(Promotion promotion);
}
