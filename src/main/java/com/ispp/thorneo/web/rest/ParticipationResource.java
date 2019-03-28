package com.ispp.thorneo.web.rest;
import com.ispp.thorneo.domain.Participation;
import com.ispp.thorneo.service.ParticipationService;
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
 * REST controller for managing Participation.
 */
@RestController
@RequestMapping("/api")
public class ParticipationResource {

    private final Logger log = LoggerFactory.getLogger(ParticipationResource.class);

    private static final String ENTITY_NAME = "participation";

    private final ParticipationService participationService;

    public ParticipationResource(ParticipationService participationService) {
        this.participationService = participationService;
    }

    /**
     * POST  /participations : Create a new participation.
     *
     * @param participation the participation to create
     * @return the ResponseEntity with status 201 (Created) and with body the new participation, or with status 400 (Bad Request) if the participation has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/participations")
    public ResponseEntity<Participation> createParticipation(@Valid @RequestBody Participation participation) throws URISyntaxException {
        log.debug("REST request to save Participation : {}", participation);
        if (participation.getId() != null) {
            throw new BadRequestAlertException("A new participation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Participation result = participationService.save(participation);
        return ResponseEntity.created(new URI("/api/participations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /participations : Updates an existing participation.
     *
     * @param participation the participation to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated participation,
     * or with status 400 (Bad Request) if the participation is not valid,
     * or with status 500 (Internal Server Error) if the participation couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/participations")
    public ResponseEntity<Participation> updateParticipation(@Valid @RequestBody Participation participation) throws URISyntaxException {
        log.debug("REST request to update Participation : {}", participation);
        if (participation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Participation result = participationService.updateParticipation(participation);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, participation.getId().toString()))
            .body(result);
    }

    /**
     * GET  /participations : get all the participations.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of participations in body
     */
    @GetMapping("/participations")
    public List<Participation> getAllParticipations() {
        log.debug("REST request to get all Participations");
        return participationService.findAll();
    }

    /**
     * GET  /participations/:id : get the "id" participation.
     *
     * @param id the id of the participation to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the participation, or with status 404 (Not Found)
     */
    @GetMapping("/participations/{id}")
    public ResponseEntity<Participation> getParticipation(@PathVariable Long id) {
        log.debug("REST request to get Participation : {}", id);
        Optional<Participation> participation = participationService.findOne(id);
        return ResponseUtil.wrapOrNotFound(participation);
    }

    /**
     * DELETE  /participations/:id : delete the "id" participation.
     *
     * @param id the id of the participation to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/participations/{id}")
    public ResponseEntity<Void> deleteParticipation(@PathVariable Long id) {
        log.debug("REST request to delete Participation : {}", id);
        participationService.deleteParticipation(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/participations?query=:query : search for the participation corresponding
     * to the query.
     *
     * @param query the query of the participation search
     * @return the result of the search
     */
    @GetMapping("/_search/participations")
    public List<Participation> searchParticipations(@RequestParam String query) {
        log.debug("REST request to search Participations for query {}", query);
        return participationService.search(query);
    }

}
