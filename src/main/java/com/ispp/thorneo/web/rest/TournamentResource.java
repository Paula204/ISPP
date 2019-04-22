package com.ispp.thorneo.web.rest;

import com.ispp.thorneo.TournamentForm;
import com.ispp.thorneo.domain.Authority;
import com.ispp.thorneo.domain.Participation;
import com.ispp.thorneo.domain.Tournament;
import com.ispp.thorneo.domain.User;
import com.ispp.thorneo.service.TournamentService;
import com.ispp.thorneo.service.UserService;
import com.ispp.thorneo.web.rest.errors.BadRequestAlertException;
import com.ispp.thorneo.web.rest.util.HeaderUtil;
import com.ispp.thorneo.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import io.micrometer.core.annotation.Timed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Tournament.
 */
@RestController
@RequestMapping("/api")
public class TournamentResource {

    private final Logger log = LoggerFactory.getLogger(TournamentResource.class);

    private static final String ENTITY_NAME = "tournament";

    private final TournamentService tournamentService;
    
    private final UserService userService;

    public TournamentResource(TournamentService tournamentService, UserService userService){
        this.tournamentService = tournamentService;
        this.userService = userService;
    }

    /**
     * POST  /tournaments : Create a new tournament.
     *
     * @param tournament the tournament to create
     * @return the ResponseEntity with status 201 (Created) and with body the new tournament, or with status 400 (Bad Request) if the tournament has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/tournaments")
    public ResponseEntity<Tournament> createTournament(@Valid @RequestBody Tournament tournament) throws URISyntaxException {
        log.debug("REST request to save Tournament : {}", tournament);
        if (tournament.getId() != null) {
            throw new BadRequestAlertException("A new tournament cannot already have an ID", ENTITY_NAME, "idexists");
        }
        tournament.setParticipations(new HashSet<Participation>());
        Tournament result = tournamentService.saveTournament(tournament);
        return ResponseEntity.created(new URI("/api/tournaments/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /tournaments : Updates an existing tournament.
     *
     * @param tournament the tournament to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated tournament,
     * or with status 400 (Bad Request) if the tournament is not valid,
     * or with status 500 (Internal Server Error) if the tournament couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/tournaments")
    public ResponseEntity<Tournament> updateTournament(@Valid @RequestBody Tournament tournament) throws URISyntaxException {
        log.debug("REST request to update Tournament : {}", tournament);
        if (tournament.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }

        User currentUser = this.userService.getUserWithAuthorities().get();

        Authority admin = new Authority();
        admin.setName("ROLE_ADMIN");

        if (tournament.getUser().getId() != currentUser.getId() && !currentUser.getAuthorities().contains(admin)) {
            throw new BadRequestAlertException("Invalid user", "tournament", "notCreator");
        }

        Tournament result = tournamentService.save(tournament);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, tournament.getId().toString()))
            .body(result);
    }

    @PutMapping("/tournaments/signOn")
    public ResponseEntity<Tournament> signOnTournament(@Valid @RequestBody Tournament tournament) throws URISyntaxException {
        log.debug("REST request to sign on Tournament: {}", tournament);
        if (tournament.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Tournament result = tournamentService.signOn(tournament);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, tournament.getId().toString()))
            .body(result);
    }

    @PutMapping("/tournaments/close")
    public ResponseEntity<Tournament> closeTournament(@Valid @RequestBody Tournament tournament) throws URISyntaxException {
        log.debug("REST request to close Tournament: {}", tournament);
        if (tournament.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Tournament result = tournamentService.closeTournament(tournament);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, tournament.getId().toString()))
            .body(result);
    }

    @PutMapping("/tournaments/closeTournament")
    public ResponseEntity<Tournament> closeFinalizedTournament(@Valid @RequestBody Tournament tournament,
     @Valid @RequestBody Long winnerId) throws URISyntaxException {
        log.debug("REST request to close Tournament finalized: {}", tournament);
        if (tournament.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (winnerId == null){
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Tournament res = this.tournamentService.closeTournamentFinalized(tournament, winnerId);
        return ResponseEntity.ok()
        .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, tournament.getId().toString()))
        .body(res);
    }
    /**
     * GET  /tournaments : get all the tournaments.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of tournaments in body
     */
    @GetMapping("/tournaments")
    public ResponseEntity<List<Tournament>> getAllTournaments(Pageable pageable) {
        log.debug("REST request to get a page of Tournaments");
        Page<Tournament> page = tournamentService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/tournaments");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    @GetMapping("/tournaments/mine")
    public ResponseEntity<List<Tournament>> getMyTournaments() {
        log.debug("REST request to get a page of my Tournaments");
        Page<Tournament> page = new PageImpl<>(tournamentService.findMyTournaments());
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/tournaments/mine");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /tournaments/:id : get the "id" tournament.
     *
     * @param id the id of the tournament to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the tournament, or with status 404 (Not Found)
     */
    @GetMapping("/tournaments/{id}")
    public ResponseEntity<TournamentForm> getTournament(@PathVariable Long id) {
        log.debug("REST request to get Tournament : {}", id);
        Optional<TournamentForm> tournament = tournamentService.getTournament(id);

        return ResponseUtil.wrapOrNotFound(tournament);
    }

    /**
     * DELETE  /tournaments/:id : delete the "id" tournament.
     *
     * @param id the id of the tournament to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/tournaments/{id}")
    public ResponseEntity<Void> deleteTournament(@PathVariable Long id) {
        log.debug("REST request to delete Tournament : {}", id);

        User currentUser = this.userService.getUserWithAuthorities().get();

        Authority admin = new Authority();
        admin.setName("ROLE_ADMIN");

        Tournament tournament = this.tournamentService.findOne(id).get();

        if (tournament.getUser().getId() != currentUser.getId() && !currentUser.getAuthorities().contains(admin)) {
            throw new BadRequestAlertException("Invalid user", "tournament", "notCreator");
        }

        tournamentService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/tournaments?query=:query : search for the tournament corresponding
     * to the query.
     *
     * @param query the query of the tournament search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/tournaments")
    public ResponseEntity<List<Tournament>> searchTournaments(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Tournaments for query {}", query);
        Page<Tournament> page = tournamentService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/tournaments");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

}
