package com.ispp.thorneo.service;

import com.ispp.thorneo.domain.Punctuation;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing Punctuation.
 */
public interface PunctuationService {

    /**
     * Save a punctuation.
     *
     * @param punctuation the entity to save
     * @return the persisted entity
     */
    Punctuation save(Punctuation punctuation);

    /**
     * Get all the punctuations.
     *
     * @return the list of entities
     */
    List<Punctuation> findAll();


    /**
     * Get the "id" punctuation.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Optional<Punctuation> findOne(Long id);

    /**
     * Delete the "id" punctuation.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the punctuation corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @return the list of entities
     */
    List<Punctuation> search(String query);
}
