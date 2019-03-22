package com.ispp.thorneo.web.rest;
import com.ispp.thorneo.domain.Actor;
import com.ispp.thorneo.service.ActorService;
import com.ispp.thorneo.web.rest.errors.BadRequestAlertException;
import com.ispp.thorneo.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Actor.
 */
@RestController
@RequestMapping("/api")
public class ActorResource {

    private final Logger log = LoggerFactory.getLogger(ActorResource.class);

    private static final String ENTITY_NAME = "actor";

    private final ActorService actorService;

    public ActorResource(ActorService actorService) {
        this.actorService = actorService;
    }

    /**
     * POST  /actors : Create a new actor.
     *
     * @param actor the actor to create
     * @return the ResponseEntity with status 201 (Created) and with body the new actor, or with status 400 (Bad Request) if the actor has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/actors")
    public ResponseEntity<Actor> createActor(@Valid @RequestBody Actor actor) throws URISyntaxException {
        log.debug("REST request to save Actor : {}", actor);
        if (actor.getId() != null) {
            throw new BadRequestAlertException("A new actor cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Actor result = actorService.save(actor);
        return ResponseEntity.created(new URI("/api/actors/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /actors : Updates an existing actor.
     *
     * @param actor the actor to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated actor,
     * or with status 400 (Bad Request) if the actor is not valid,
     * or with status 500 (Internal Server Error) if the actor couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/actors")
    public ResponseEntity<Actor> updateActor(@Valid @RequestBody Actor actor) throws URISyntaxException {
        log.debug("REST request to update Actor : {}", actor);
        if (actor.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Actor result = actorService.save(actor);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, actor.getId().toString()))
            .body(result);
    }

    /**
     * GET  /actors : get all the actors.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of actors in body
     */
    @GetMapping("/actors")
    public List<Actor> getAllActors() {
        log.debug("REST request to get all Actors");
        return actorService.findAll();
    }

    /**
     * GET  /actors/:id : get the "id" actor.
     *
     * @param id the id of the actor to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the actor, or with status 404 (Not Found)
     */
    @GetMapping("/actors/{id}")
    public ResponseEntity<Actor> getActor(@PathVariable Long id) {
        log.debug("REST request to get Actor : {}", id);
        Optional<Actor> actor = actorService.findOne(id);
        return ResponseUtil.wrapOrNotFound(actor);
    }

    /**
     * DELETE  /actors/:id : delete the "id" actor.
     *
     * @param id the id of the actor to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/actors/{id}")
    public ResponseEntity<Void> deleteActor(@PathVariable Long id) {
        log.debug("REST request to delete Actor : {}", id);
        actorService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/actors?query=:query : search for the actor corresponding
     * to the query.
     *
     * @param query the query of the actor search
     * @return the result of the search
     */
    @GetMapping("/_search/actors")
    public List<Actor> searchActors(@RequestParam String query) {
        log.debug("REST request to search Actors for query {}", query);
        return actorService.search(query);
    }

}
