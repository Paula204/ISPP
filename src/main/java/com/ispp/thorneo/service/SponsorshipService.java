package com.ispp.thorneo.service;

import com.ispp.thorneo.domain.Sponsorship;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing Sponsorship.
 */
public interface SponsorshipService {

    /**
     * Save a sponsorship.
     *
     * @param sponsorship the entity to save
     * @return the persisted entity
     */
    Sponsorship save(Sponsorship sponsorship);

    /**
     * Get all the sponsorships.
     *
     * @return the list of entities
     */
    List<Sponsorship> findAll();


    /**
     * Get the "id" sponsorship.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Optional<Sponsorship> findOne(Long id);

    /**
     * Delete the "id" sponsorship.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the sponsorship corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @return the list of entities
     */
    List<Sponsorship> search(String query);
}
