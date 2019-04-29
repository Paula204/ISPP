package com.ispp.thorneo.web.rest;
import com.ispp.thorneo.domain.Punctuation;
import com.ispp.thorneo.service.PunctuationService;
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
 * REST controller for managing Punctuation.
 */
@RestController
@RequestMapping("/api")
public class PunctuationResource {

    private final Logger log = LoggerFactory.getLogger(PunctuationResource.class);

    private static final String ENTITY_NAME = "punctuation";

    private final PunctuationService punctuationService;

    public PunctuationResource(PunctuationService punctuationService) {
        this.punctuationService = punctuationService;
    }

    /**
     * POST  /punctuations : Create a new punctuation.
     *
     * @param punctuation the punctuation to create
     * @return the ResponseEntity with status 201 (Created) and with body the new punctuation, or with status 400 (Bad Request) if the punctuation has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/punctuations")
    public ResponseEntity<Punctuation> createPunctuation(@Valid @RequestBody Punctuation punctuation) throws URISyntaxException {
        log.debug("REST request to save Punctuation : {}", punctuation);
        if (punctuation.getId() != null) {
            throw new BadRequestAlertException("A new punctuation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Punctuation result = punctuationService.save(punctuation);
        return ResponseEntity.created(new URI("/api/punctuations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /punctuations : Updates an existing punctuation.
     *
     * @param punctuation the punctuation to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated punctuation,
     * or with status 400 (Bad Request) if the punctuation is not valid,
     * or with status 500 (Internal Server Error) if the punctuation couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/punctuations")
    public ResponseEntity<Punctuation> updatePunctuation(@Valid @RequestBody Punctuation punctuation) throws URISyntaxException {
        log.debug("REST request to update Punctuation : {}", punctuation);
        if (punctuation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Punctuation result = punctuationService.save(punctuation);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, punctuation.getId().toString()))
            .body(result);
    }

    /**
     * GET  /punctuations : get all the punctuations.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of punctuations in body
     */
    @GetMapping("/punctuations")
    public List<Punctuation> getAllPunctuations() {
        log.debug("REST request to get all Punctuations");
        return punctuationService.findAll();
    }

    /**
     * GET  /punctuations/:id : get the "id" punctuation.
     *
     * @param id the id of the punctuation to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the punctuation, or with status 404 (Not Found)
     */
    @GetMapping("/punctuations/{id}")
    public ResponseEntity<Punctuation> getPunctuation(@PathVariable Long id) {
        log.debug("REST request to get Punctuation : {}", id);
        Optional<Punctuation> punctuation = punctuationService.findOne(id);
        return ResponseUtil.wrapOrNotFound(punctuation);
    }

    /**
     * DELETE  /punctuations/:id : delete the "id" punctuation.
     *
     * @param id the id of the punctuation to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/punctuations/{id}")
    public ResponseEntity<Void> deletePunctuation(@PathVariable Long id) {
        log.debug("REST request to delete Punctuation : {}", id);
        punctuationService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/punctuations?query=:query : search for the punctuation corresponding
     * to the query.
     *
     * @param query the query of the punctuation search
     * @return the result of the search
     */
    @GetMapping("/_search/punctuations")
    public List<Punctuation> searchPunctuations(@RequestParam String query) {
        log.debug("REST request to search Punctuations for query {}", query);
        return punctuationService.search(query);
    }

}
