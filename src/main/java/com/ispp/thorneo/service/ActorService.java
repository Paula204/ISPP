package com.ispp.thorneo.service;

import com.ispp.thorneo.domain.Actor;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing Actor.
 */
public interface ActorService {

    /**
     * Save a actor.
     *
     * @param actor the entity to save
     * @return the persisted entity
     */
    Actor save(Actor actor);

    /**
     * Get all the actors.
     *
     * @return the list of entities
     */
    List<Actor> findAll();


    /**
     * Get the "id" actor.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Optional<Actor> findOne(Long id);

    /**
     * Delete the "id" actor.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the actor corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @return the list of entities
     */
    List<Actor> search(String query);
}
