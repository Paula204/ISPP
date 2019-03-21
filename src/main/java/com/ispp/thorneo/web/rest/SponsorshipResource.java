package com.ispp.thorneo.web.rest;
import com.ispp.thorneo.domain.Sponsorship;
import com.ispp.thorneo.repository.SponsorshipRepository;
import com.ispp.thorneo.repository.search.SponsorshipSearchRepository;
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
 * REST controller for managing Sponsorship.
 */
@RestController
@RequestMapping("/api")
public class SponsorshipResource {

    private final Logger log = LoggerFactory.getLogger(SponsorshipResource.class);

    private static final String ENTITY_NAME = "sponsorship";

    private final SponsorshipRepository sponsorshipRepository;

    private final SponsorshipSearchRepository sponsorshipSearchRepository;

    public SponsorshipResource(SponsorshipRepository sponsorshipRepository, SponsorshipSearchRepository sponsorshipSearchRepository) {
        this.sponsorshipRepository = sponsorshipRepository;
        this.sponsorshipSearchRepository = sponsorshipSearchRepository;
    }

    /**
     * POST  /sponsorships : Create a new sponsorship.
     *
     * @param sponsorship the sponsorship to create
     * @return the ResponseEntity with status 201 (Created) and with body the new sponsorship, or with status 400 (Bad Request) if the sponsorship has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/sponsorships")
    public ResponseEntity<Sponsorship> createSponsorship(@Valid @RequestBody Sponsorship sponsorship) throws URISyntaxException {
        log.debug("REST request to save Sponsorship : {}", sponsorship);
        if (sponsorship.getId() != null) {
            throw new BadRequestAlertException("A new sponsorship cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Sponsorship result = sponsorshipRepository.save(sponsorship);
        sponsorshipSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/sponsorships/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /sponsorships : Updates an existing sponsorship.
     *
     * @param sponsorship the sponsorship to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated sponsorship,
     * or with status 400 (Bad Request) if the sponsorship is not valid,
     * or with status 500 (Internal Server Error) if the sponsorship couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/sponsorships")
    public ResponseEntity<Sponsorship> updateSponsorship(@Valid @RequestBody Sponsorship sponsorship) throws URISyntaxException {
        log.debug("REST request to update Sponsorship : {}", sponsorship);
        if (sponsorship.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Sponsorship result = sponsorshipRepository.save(sponsorship);
        sponsorshipSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, sponsorship.getId().toString()))
            .body(result);
    }

    /**
     * GET  /sponsorships : get all the sponsorships.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of sponsorships in body
     */
    @GetMapping("/sponsorships")
    public List<Sponsorship> getAllSponsorships() {
        log.debug("REST request to get all Sponsorships");
        return sponsorshipRepository.findAll();
    }

    /**
     * GET  /sponsorships/:id : get the "id" sponsorship.
     *
     * @param id the id of the sponsorship to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the sponsorship, or with status 404 (Not Found)
     */
    @GetMapping("/sponsorships/{id}")
    public ResponseEntity<Sponsorship> getSponsorship(@PathVariable Long id) {
        log.debug("REST request to get Sponsorship : {}", id);
        Optional<Sponsorship> sponsorship = sponsorshipRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(sponsorship);
    }

    /**
     * DELETE  /sponsorships/:id : delete the "id" sponsorship.
     *
     * @param id the id of the sponsorship to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/sponsorships/{id}")
    public ResponseEntity<Void> deleteSponsorship(@PathVariable Long id) {
        log.debug("REST request to delete Sponsorship : {}", id);
        sponsorshipRepository.deleteById(id);
        sponsorshipSearchRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/sponsorships?query=:query : search for the sponsorship corresponding
     * to the query.
     *
     * @param query the query of the sponsorship search
     * @return the result of the search
     */
    @GetMapping("/_search/sponsorships")
    public List<Sponsorship> searchSponsorships(@RequestParam String query) {
        log.debug("REST request to search Sponsorships for query {}", query);
        return StreamSupport
            .stream(sponsorshipSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}