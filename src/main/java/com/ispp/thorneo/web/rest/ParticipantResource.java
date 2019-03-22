package com.ispp.thorneo.web.rest;
import com.ispp.thorneo.repository.search.ParticipantSearchRepository;
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
 * REST controller for managing Participant.
 */
@RestController
@RequestMapping("/api")
public class ParticipantResource {

    private final Logger log = LoggerFactory.getLogger(ParticipantResource.class);

    private static final String ENTITY_NAME = "participant";

    private final ParticipantRepository participantRepository;

    private final ParticipantSearchRepository participantSearchRepository;

    public ParticipantResource(ParticipantRepository participantRepository, ParticipantSearchRepository participantSearchRepository) {
        this.participantRepository = participantRepository;
        this.participantSearchRepository = participantSearchRepository;
    }

    /**
     * POST  /participants : Create a new participant.
     *
     * @param participant the participant to create
     * @return the ResponseEntity with status 201 (Created) and with body the new participant, or with status 400 (Bad Request) if the participant has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/participants")
    public ResponseEntity<Participant> createParticipant(@Valid @RequestBody Participant participant) throws URISyntaxException {
        log.debug("REST request to save Participant : {}", participant);
        if (participant.getId() != null) {
            throw new BadRequestAlertException("A new participant cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Participant result = participantRepository.save(participant);
        participantSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/participants/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /participants : Updates an existing participant.
     *
     * @param participant the participant to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated participant,
     * or with status 400 (Bad Request) if the participant is not valid,
     * or with status 500 (Internal Server Error) if the participant couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/participants")
    public ResponseEntity<Participant> updateParticipant(@Valid @RequestBody Participant participant) throws URISyntaxException {
        log.debug("REST request to update Participant : {}", participant);
        if (participant.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Participant result = participantRepository.save(participant);
        participantSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, participant.getId().toString()))
            .body(result);
    }

    /**
     * GET  /participants : get all the participants.
     *
     * @param filter the filter of the request
     * @return the ResponseEntity with status 200 (OK) and the list of participants in body
     */
    @GetMapping("/participants")
    public List<Participant> getAllParticipants(@RequestParam(required = false) String filter) {
        if ("clasification-is-null".equals(filter)) {
            log.debug("REST request to get all Participants where clasification is null");
            return StreamSupport
                .stream(participantRepository.findAll().spliterator(), false)
                .filter(participant -> participant.getClasification() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all Participants");
        return participantRepository.findAll();
    }

    /**
     * GET  /participants/:id : get the "id" participant.
     *
     * @param id the id of the participant to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the participant, or with status 404 (Not Found)
     */
    @GetMapping("/participants/{id}")
    public ResponseEntity<Participant> getParticipant(@PathVariable Long id) {
        log.debug("REST request to get Participant : {}", id);
        Optional<Participant> participant = participantRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(participant);
    }

    /**
     * DELETE  /participants/:id : delete the "id" participant.
     *
     * @param id the id of the participant to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/participants/{id}")
    public ResponseEntity<Void> deleteParticipant(@PathVariable Long id) {
        log.debug("REST request to delete Participant : {}", id);
        participantRepository.deleteById(id);
        participantSearchRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/participants?query=:query : search for the participant corresponding
     * to the query.
     *
     * @param query the query of the participant search
     * @return the result of the search
     */
    @GetMapping("/_search/participants")
    public List<Participant> searchParticipants(@RequestParam String query) {
        log.debug("REST request to search Participants for query {}", query);
        return StreamSupport
            .stream(participantSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
