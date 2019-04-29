package com.ispp.thorneo.web.rest;
import com.ispp.thorneo.domain.Authority;
import com.ispp.thorneo.domain.Participation;
import com.ispp.thorneo.domain.User;
import com.ispp.thorneo.service.ParticipationService;
import com.ispp.thorneo.service.UserService;
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

import java.time.Instant;
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

    private UserService userService;

    public ParticipationResource(ParticipationService participationService, UserService userService) {
        this.participationService = participationService;
        this.userService = userService;
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

        Participation participation = participationService.findOne(id).get();

        User currentUser = this.userService.getUserWithAuthorities().get();

        Authority admin = new Authority();
        admin.setName("ROLE_ADMIN");

        if (participation.getUser().getId() != currentUser.getId() && !currentUser.getAuthorities().contains(admin)) {
            throw new BadRequestAlertException("Invalid user", "participation", "notCreator");
        }
        if (Instant.now().isAfter(participation.getTournament().getMeetingDate())) {
            throw new BadRequestAlertException("Invalid user", "participation", "dateAfter");
        }

        participationService.delete(id);
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

    @PutMapping("/participations/disqualify")
    public ResponseEntity<Participation> disqualify(@Valid @RequestBody Long participationId) throws URISyntaxException {
        log.debug("REST request to update Participation : {}", participationId);
        if (participationId == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Participation result = participationService.disqualify(participationId);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, participationId.toString()))
            .body(result);
    }

    @PutMapping("/participations/win")
    public ResponseEntity<Participation> win(@Valid @RequestBody Long participationId) throws URISyntaxException {
        log.debug("REST request to update Participation : {}", participationId);
        if (participationId == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Participation result = participationService.win(participationId);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, participationId.toString()))
            .body(result);
    }

    @PutMapping("/participations/tie")
    public ResponseEntity<Participation> tie(@Valid @RequestBody Long participationId) throws URISyntaxException {
        log.debug("REST request to update Participation : {}", participationId);
        if (participationId == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Participation result = participationService.tie(participationId);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, participationId.toString()))
            .body(result);
    }

}
