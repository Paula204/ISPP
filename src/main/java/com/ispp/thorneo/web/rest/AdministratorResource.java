package com.ispp.thorneo.web.rest;
import com.ispp.thorneo.domain.Administrator;
import com.ispp.thorneo.repository.AdministratorRepository;
import com.ispp.thorneo.repository.search.AdministratorSearchRepository;
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
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Administrator.
 */
@RestController
@RequestMapping("/api")
public class AdministratorResource {

    private final Logger log = LoggerFactory.getLogger(AdministratorResource.class);

    private static final String ENTITY_NAME = "administrator";

    private final AdministratorRepository administratorRepository;

    private final AdministratorSearchRepository administratorSearchRepository;

    public AdministratorResource(AdministratorRepository administratorRepository, AdministratorSearchRepository administratorSearchRepository) {
        this.administratorRepository = administratorRepository;
        this.administratorSearchRepository = administratorSearchRepository;
    }

    /**
     * POST  /administrators : Create a new administrator.
     *
     * @param administrator the administrator to create
     * @return the ResponseEntity with status 201 (Created) and with body the new administrator, or with status 400 (Bad Request) if the administrator has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/administrators")
    public ResponseEntity<Administrator> createAdministrator(@RequestBody Administrator administrator) throws URISyntaxException {
        log.debug("REST request to save Administrator : {}", administrator);
        if (administrator.getId() != null) {
            throw new BadRequestAlertException("A new administrator cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Administrator result = administratorRepository.save(administrator);
        administratorSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/administrators/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /administrators : Updates an existing administrator.
     *
     * @param administrator the administrator to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated administrator,
     * or with status 400 (Bad Request) if the administrator is not valid,
     * or with status 500 (Internal Server Error) if the administrator couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/administrators")
    public ResponseEntity<Administrator> updateAdministrator(@RequestBody Administrator administrator) throws URISyntaxException {
        log.debug("REST request to update Administrator : {}", administrator);
        if (administrator.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Administrator result = administratorRepository.save(administrator);
        administratorSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, administrator.getId().toString()))
            .body(result);
    }

    /**
     * GET  /administrators : get all the administrators.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of administrators in body
     */
    @GetMapping("/administrators")
    public List<Administrator> getAllAdministrators() {
        log.debug("REST request to get all Administrators");
        return administratorRepository.findAll();
    }

    /**
     * GET  /administrators/:id : get the "id" administrator.
     *
     * @param id the id of the administrator to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the administrator, or with status 404 (Not Found)
     */
    @GetMapping("/administrators/{id}")
    public ResponseEntity<Administrator> getAdministrator(@PathVariable Long id) {
        log.debug("REST request to get Administrator : {}", id);
        Optional<Administrator> administrator = administratorRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(administrator);
    }

    /**
     * DELETE  /administrators/:id : delete the "id" administrator.
     *
     * @param id the id of the administrator to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/administrators/{id}")
    public ResponseEntity<Void> deleteAdministrator(@PathVariable Long id) {
        log.debug("REST request to delete Administrator : {}", id);
        administratorRepository.deleteById(id);
        administratorSearchRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/administrators?query=:query : search for the administrator corresponding
     * to the query.
     *
     * @param query the query of the administrator search
     * @return the result of the search
     */
    @GetMapping("/_search/administrators")
    public List<Administrator> searchAdministrators(@RequestParam String query) {
        log.debug("REST request to search Administrators for query {}", query);
        return StreamSupport
            .stream(administratorSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
