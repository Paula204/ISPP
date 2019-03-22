package com.ispp.thorneo.web.rest;
import com.ispp.thorneo.domain.UserAccount;
import com.ispp.thorneo.repository.UserAccountRepository;
import com.ispp.thorneo.repository.search.UserAccountSearchRepository;
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
 * REST controller for managing UserAccount.
 */
@RestController
@RequestMapping("/api")
public class UserAccountResource {

    private final Logger log = LoggerFactory.getLogger(UserAccountResource.class);

    private static final String ENTITY_NAME = "userAccount";

    private final UserAccountRepository userAccountRepository;

    private final UserAccountSearchRepository userAccountSearchRepository;

    public UserAccountResource(UserAccountRepository userAccountRepository, UserAccountSearchRepository userAccountSearchRepository) {
        this.userAccountRepository = userAccountRepository;
        this.userAccountSearchRepository = userAccountSearchRepository;
    }

    /**
     * POST  /user-accounts : Create a new userAccount.
     *
     * @param userAccount the userAccount to create
     * @return the ResponseEntity with status 201 (Created) and with body the new userAccount, or with status 400 (Bad Request) if the userAccount has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/user-accounts")
    public ResponseEntity<UserAccount> createUserAccount(@Valid @RequestBody UserAccount userAccount) throws URISyntaxException {
        log.debug("REST request to save UserAccount : {}", userAccount);
        if (userAccount.getId() != null) {
            throw new BadRequestAlertException("A new userAccount cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UserAccount result = userAccountRepository.save(userAccount);
        userAccountSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/user-accounts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /user-accounts : Updates an existing userAccount.
     *
     * @param userAccount the userAccount to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated userAccount,
     * or with status 400 (Bad Request) if the userAccount is not valid,
     * or with status 500 (Internal Server Error) if the userAccount couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/user-accounts")
    public ResponseEntity<UserAccount> updateUserAccount(@Valid @RequestBody UserAccount userAccount) throws URISyntaxException {
        log.debug("REST request to update UserAccount : {}", userAccount);
        if (userAccount.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        UserAccount result = userAccountRepository.save(userAccount);
        userAccountSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, userAccount.getId().toString()))
            .body(result);
    }

    /**
     * GET  /user-accounts : get all the userAccounts.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of userAccounts in body
     */
    @GetMapping("/user-accounts")
    public List<UserAccount> getAllUserAccounts() {
        log.debug("REST request to get all UserAccounts");
        return userAccountRepository.findAll();
    }

    /**
     * GET  /user-accounts/:id : get the "id" userAccount.
     *
     * @param id the id of the userAccount to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the userAccount, or with status 404 (Not Found)
     */
    @GetMapping("/user-accounts/{id}")
    public ResponseEntity<UserAccount> getUserAccount(@PathVariable Long id) {
        log.debug("REST request to get UserAccount : {}", id);
        Optional<UserAccount> userAccount = userAccountRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(userAccount);
    }

    /**
     * DELETE  /user-accounts/:id : delete the "id" userAccount.
     *
     * @param id the id of the userAccount to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/user-accounts/{id}")
    public ResponseEntity<Void> deleteUserAccount(@PathVariable Long id) {
        log.debug("REST request to delete UserAccount : {}", id);
        userAccountRepository.deleteById(id);
        userAccountSearchRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/user-accounts?query=:query : search for the userAccount corresponding
     * to the query.
     *
     * @param query the query of the userAccount search
     * @return the result of the search
     */
    @GetMapping("/_search/user-accounts")
    public List<UserAccount> searchUserAccounts(@RequestParam String query) {
        log.debug("REST request to search UserAccounts for query {}", query);
        return StreamSupport
            .stream(userAccountSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
