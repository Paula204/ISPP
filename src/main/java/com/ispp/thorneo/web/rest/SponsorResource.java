package com.ispp.thorneo.web.rest;
import com.ispp.thorneo.domain.Sponsor;
import com.ispp.thorneo.service.SponsorService;
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
 * REST controller for managing Sponsor.
 */
@RestController
@RequestMapping("/api")
public class SponsorResource {

    private final Logger log = LoggerFactory.getLogger(SponsorResource.class);

    private static final String ENTITY_NAME = "sponsor";

    private final SponsorService sponsorService;

    public SponsorResource(SponsorService sponsorService) {
        this.sponsorService = sponsorService;
    }

    /**
     * POST  /sponsors : Create a new sponsor.
     *
     * @param sponsor the sponsor to create
     * @return the ResponseEntity with status 201 (Created) and with body the new sponsor, or with status 400 (Bad Request) if the sponsor has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/sponsors")
    public ResponseEntity<Sponsor> createSponsor(@RequestBody Sponsor sponsor) throws URISyntaxException {
        log.debug("REST request to save Sponsor : {}", sponsor);
        if (sponsor.getId() != null) {
            throw new BadRequestAlertException("A new sponsor cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Sponsor result = sponsorService.save(sponsor);
        return ResponseEntity.created(new URI("/api/sponsors/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /sponsors : Updates an existing sponsor.
     *
     * @param sponsor the sponsor to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated sponsor,
     * or with status 400 (Bad Request) if the sponsor is not valid,
     * or with status 500 (Internal Server Error) if the sponsor couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/sponsors")
    public ResponseEntity<Sponsor> updateSponsor(@RequestBody Sponsor sponsor) throws URISyntaxException {
        log.debug("REST request to update Sponsor : {}", sponsor);
        if (sponsor.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Sponsor result = sponsorService.save(sponsor);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, sponsor.getId().toString()))
            .body(result);
    }

    /**
     * GET  /sponsors : get all the sponsors.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many)
     * @return the ResponseEntity with status 200 (OK) and the list of sponsors in body
     */
    @GetMapping("/sponsors")
    public List<Sponsor> getAllSponsors(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Sponsors");
        return sponsorService.findAll();
    }

    /**
     * GET  /sponsors/:id : get the "id" sponsor.
     *
     * @param id the id of the sponsor to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the sponsor, or with status 404 (Not Found)
     */
    @GetMapping("/sponsors/{id}")
    public ResponseEntity<Sponsor> getSponsor(@PathVariable Long id) {
        log.debug("REST request to get Sponsor : {}", id);
        Optional<Sponsor> sponsor = sponsorService.findOne(id);
        return ResponseUtil.wrapOrNotFound(sponsor);
    }

    /**
     * DELETE  /sponsors/:id : delete the "id" sponsor.
     *
     * @param id the id of the sponsor to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/sponsors/{id}")
    public ResponseEntity<Void> deleteSponsor(@PathVariable Long id) {
        log.debug("REST request to delete Sponsor : {}", id);
        sponsorService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/sponsors?query=:query : search for the sponsor corresponding
     * to the query.
     *
     * @param query the query of the sponsor search
     * @return the result of the search
     */
    @GetMapping("/_search/sponsors")
    public List<Sponsor> searchSponsors(@RequestParam String query) {
        log.debug("REST request to search Sponsors for query {}", query);
        return sponsorService.search(query);
    }

}
