package com.ispp.thorneo.service;

import com.ispp.thorneo.domain.Tournament;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Service Interface for managing Tournament.
 */
public interface TournamentService {

    /**
     * Save a tournament.
     *
     * @param tournament the entity to save
     * @return the persisted entity
     */
    Tournament save(Tournament tournament);

    /**
     * Get all the tournaments.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    Page<Tournament> findAll(Pageable pageable);


    /**
     * Get the "id" tournament.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Optional<Tournament> findOne(Long id);

    /**
     * Delete the "id" tournament.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the tournament corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @param pageable the pagination information
     * @return the list of entities
     */
    Page<Tournament> search(String query, Pageable pageable);

    /**
     * Assign current user as creator of the tournament and check if player's size is null
     */
     Tournament saveTournament(Tournament tournament);

    /**
      * Add current user to the tournament
      */
      Tournament signOn(Tournament tournament);
}
