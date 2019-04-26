package com.ispp.thorneo.web.rest;
import com.ispp.thorneo.domain.Puntuation;
import com.ispp.thorneo.repository.PuntuationRepository;
import com.ispp.thorneo.repository.search.PuntuationSearchRepository;
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
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Puntuation.
 */
@RestController
@RequestMapping("/api")
public class PuntuationResource {

    private final Logger log = LoggerFactory.getLogger(PuntuationResource.class);

    private static final String ENTITY_NAME = "puntuation";

    private final PuntuationRepository puntuationRepository;

    private final PuntuationSearchRepository puntuationSearchRepository;

    public PuntuationResource(PuntuationRepository puntuationRepository, PuntuationSearchRepository puntuationSearchRepository) {
        this.puntuationRepository = puntuationRepository;
        this.puntuationSearchRepository = puntuationSearchRepository;
    }

    /**
     * POST  /puntuations : Create a new puntuation.
     *
     * @param puntuation the puntuation to create
     * @return the ResponseEntity with status 201 (Created) and with body the new puntuation, or with status 400 (Bad Request) if the puntuation has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/puntuations")
    public ResponseEntity<Puntuation> createPuntuation(@Valid @RequestBody Puntuation puntuation) throws URISyntaxException {
        log.debug("REST request to save Puntuation : {}", puntuation);
        if (puntuation.getId() != null) {
            throw new BadRequestAlertException("A new puntuation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Puntuation result = puntuationRepository.save(puntuation);
        puntuationSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/puntuations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /puntuations : Updates an existing puntuation.
     *
     * @param puntuation the puntuation to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated puntuation,
     * or with status 400 (Bad Request) if the puntuation is not valid,
     * or with status 500 (Internal Server Error) if the puntuation couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/puntuations")
    public ResponseEntity<Puntuation> updatePuntuation(@Valid @RequestBody Puntuation puntuation) throws URISyntaxException {
        log.debug("REST request to update Puntuation : {}", puntuation);
        if (puntuation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Puntuation result = puntuationRepository.save(puntuation);
        puntuationSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, puntuation.getId().toString()))
            .body(result);
    }

    /**
     * GET  /puntuations : get all the puntuations.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of puntuations in body
     */
    @GetMapping("/puntuations")
    public List<Puntuation> getAllPuntuations() {
        log.debug("REST request to get all Puntuations");
        return puntuationRepository.findAll();
    }

    /**
     * GET  /puntuations/:id : get the "id" puntuation.
     *
     * @param id the id of the puntuation to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the puntuation, or with status 404 (Not Found)
     */
    @GetMapping("/puntuations/{id}")
    public ResponseEntity<Puntuation> getPuntuation(@PathVariable Long id) {
        log.debug("REST request to get Puntuation : {}", id);
        Optional<Puntuation> puntuation = puntuationRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(puntuation);
    }

    /**
     * DELETE  /puntuations/:id : delete the "id" puntuation.
     *
     * @param id the id of the puntuation to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/puntuations/{id}")
    public ResponseEntity<Void> deletePuntuation(@PathVariable Long id) {
        log.debug("REST request to delete Puntuation : {}", id);
        puntuationRepository.deleteById(id);
        puntuationSearchRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/puntuations?query=:query : search for the puntuation corresponding
     * to the query.
     *
     * @param query the query of the puntuation search
     * @return the result of the search
     */
    @GetMapping("/_search/puntuations")
    public List<Puntuation> searchPuntuations(@RequestParam String query) {
        log.debug("REST request to search Puntuations for query {}", query);
        return StreamSupport
            .stream(puntuationSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
