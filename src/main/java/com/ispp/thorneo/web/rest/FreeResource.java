package com.ispp.thorneo.web.rest;
import com.ispp.thorneo.domain.Free;
import com.ispp.thorneo.service.FreeService;
import com.ispp.thorneo.web.rest.errors.BadRequestAlertException;
import com.ispp.thorneo.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Free.
 */
@RestController
@RequestMapping("/api")
public class FreeResource {

    private final Logger log = LoggerFactory.getLogger(FreeResource.class);

    private static final String ENTITY_NAME = "free";

    private final FreeService freeService;

    public FreeResource(FreeService freeService) {
        this.freeService = freeService;
    }

    /**
     * POST  /frees : Create a new free.
     *
     * @param free the free to create
     * @return the ResponseEntity with status 201 (Created) and with body the new free, or with status 400 (Bad Request) if the free has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/frees")
    public ResponseEntity<Free> createFree(@RequestBody Free free) throws URISyntaxException {
        log.debug("REST request to save Free : {}", free);
        if (free.getId() != null) {
            throw new BadRequestAlertException("A new free cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Free result = freeService.save(free);
        return ResponseEntity.created(new URI("/api/frees/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /frees : Updates an existing free.
     *
     * @param free the free to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated free,
     * or with status 400 (Bad Request) if the free is not valid,
     * or with status 500 (Internal Server Error) if the free couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/frees")
    public ResponseEntity<Free> updateFree(@RequestBody Free free) throws URISyntaxException {
        log.debug("REST request to update Free : {}", free);
        if (free.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Free result = freeService.save(free);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, free.getId().toString()))
            .body(result);
    }

    /**
     * GET  /frees : get all the frees.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many)
     * @return the ResponseEntity with status 200 (OK) and the list of frees in body
     */
    @GetMapping("/frees")
    public List<Free> getAllFrees(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Frees");
        return freeService.findAll();
    }

    /**
     * GET  /frees/:id : get the "id" free.
     *
     * @param id the id of the free to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the free, or with status 404 (Not Found)
     */
    @GetMapping("/frees/{id}")
    public ResponseEntity<Free> getFree(@PathVariable Long id) {
        log.debug("REST request to get Free : {}", id);
        Optional<Free> free = freeService.findOne(id);
        return ResponseUtil.wrapOrNotFound(free);
    }

    /**
     * DELETE  /frees/:id : delete the "id" free.
     *
     * @param id the id of the free to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/frees/{id}")
    public ResponseEntity<Void> deleteFree(@PathVariable Long id) {
        log.debug("REST request to delete Free : {}", id);
        freeService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/frees?query=:query : search for the free corresponding
     * to the query.
     *
     * @param query the query of the free search
     * @return the result of the search
     */
    @GetMapping("/_search/frees")
    public List<Free> searchFrees(@RequestParam String query) {
        log.debug("REST request to search Frees for query {}", query);
        return freeService.search(query);
    }

}
