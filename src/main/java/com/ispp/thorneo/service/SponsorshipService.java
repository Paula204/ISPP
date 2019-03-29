package com.ispp.thorneo.service;

import com.ispp.thorneo.domain.Sponsorship;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

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
     * @param pageable the pagination information
     * @return the list of entities
     */
    Page<Sponsorship> findAll(Pageable pageable);


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
     * @param pageable the pagination information
     * @return the list of entities
     */
    Page<Sponsorship> search(String query, Pageable pageable);
}
