package com.ispp.thorneo.web.rest;
import com.ispp.thorneo.repository.search.ClasificationSearchRepository;
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
 * REST controller for managing Clasification.
 */
@RestController
@RequestMapping("/api")
public class ClasificationResource {

    private final Logger log = LoggerFactory.getLogger(ClasificationResource.class);

    private static final String ENTITY_NAME = "clasification";

    private final ClasificationRepository clasificationRepository;

    private final ClasificationSearchRepository clasificationSearchRepository;

    public ClasificationResource(ClasificationRepository clasificationRepository, ClasificationSearchRepository clasificationSearchRepository) {
        this.clasificationRepository = clasificationRepository;
        this.clasificationSearchRepository = clasificationSearchRepository;
    }

    /**
     * POST  /clasifications : Create a new clasification.
     *
     * @param clasification the clasification to create
     * @return the ResponseEntity with status 201 (Created) and with body the new clasification, or with status 400 (Bad Request) if the clasification has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/clasifications")
    public ResponseEntity<Clasification> createClasification(@Valid @RequestBody Clasification clasification) throws URISyntaxException {
        log.debug("REST request to save Clasification : {}", clasification);
        if (clasification.getId() != null) {
            throw new BadRequestAlertException("A new clasification cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Clasification result = clasificationRepository.save(clasification);
        clasificationSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/clasifications/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /clasifications : Updates an existing clasification.
     *
     * @param clasification the clasification to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated clasification,
     * or with status 400 (Bad Request) if the clasification is not valid,
     * or with status 500 (Internal Server Error) if the clasification couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/clasifications")
    public ResponseEntity<Clasification> updateClasification(@Valid @RequestBody Clasification clasification) throws URISyntaxException {
        log.debug("REST request to update Clasification : {}", clasification);
        if (clasification.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Clasification result = clasificationRepository.save(clasification);
        clasificationSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, clasification.getId().toString()))
            .body(result);
    }

    /**
     * GET  /clasifications : get all the clasifications.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of clasifications in body
     */
    @GetMapping("/clasifications")
    public List<Clasification> getAllClasifications() {
        log.debug("REST request to get all Clasifications");
        return clasificationRepository.findAll();
    }

    /**
     * GET  /clasifications/:id : get the "id" clasification.
     *
     * @param id the id of the clasification to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the clasification, or with status 404 (Not Found)
     */
    @GetMapping("/clasifications/{id}")
    public ResponseEntity<Clasification> getClasification(@PathVariable Long id) {
        log.debug("REST request to get Clasification : {}", id);
        Optional<Clasification> clasification = clasificationRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(clasification);
    }

    /**
     * DELETE  /clasifications/:id : delete the "id" clasification.
     *
     * @param id the id of the clasification to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/clasifications/{id}")
    public ResponseEntity<Void> deleteClasification(@PathVariable Long id) {
        log.debug("REST request to delete Clasification : {}", id);
        clasificationRepository.deleteById(id);
        clasificationSearchRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/clasifications?query=:query : search for the clasification corresponding
     * to the query.
     *
     * @param query the query of the clasification search
     * @return the result of the search
     */
    @GetMapping("/_search/clasifications")
    public List<Clasification> searchClasifications(@RequestParam String query) {
        log.debug("REST request to search Clasifications for query {}", query);
        return StreamSupport
            .stream(clasificationSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
