package com.ispp.thorneo.web.rest;
import com.ispp.thorneo.domain.PaypalCompletedPayments;
import com.ispp.thorneo.repository.PaypalCompletedPaymentsRepository;
import com.ispp.thorneo.repository.search.PaypalCompletedPaymentsSearchRepository;
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
 * REST controller for managing PaypalCompletedPayments.
 */
@RestController
@RequestMapping("/api")
public class PaypalCompletedPaymentsResource {

    private final Logger log = LoggerFactory.getLogger(PaypalCompletedPaymentsResource.class);

    private static final String ENTITY_NAME = "paypalCompletedPayments";

    private final PaypalCompletedPaymentsRepository paypalCompletedPaymentsRepository;

    private final PaypalCompletedPaymentsSearchRepository paypalCompletedPaymentsSearchRepository;

    public PaypalCompletedPaymentsResource(PaypalCompletedPaymentsRepository paypalCompletedPaymentsRepository, PaypalCompletedPaymentsSearchRepository paypalCompletedPaymentsSearchRepository) {
        this.paypalCompletedPaymentsRepository = paypalCompletedPaymentsRepository;
        this.paypalCompletedPaymentsSearchRepository = paypalCompletedPaymentsSearchRepository;
    }

    /**
     * POST  /paypal-completed-payments : Create a new paypalCompletedPayments.
     *
     * @param paypalCompletedPayments the paypalCompletedPayments to create
     * @return the ResponseEntity with status 201 (Created) and with body the new paypalCompletedPayments, or with status 400 (Bad Request) if the paypalCompletedPayments has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/paypal-completed-payments")
    public ResponseEntity<PaypalCompletedPayments> createPaypalCompletedPayments(@Valid @RequestBody PaypalCompletedPayments paypalCompletedPayments) throws URISyntaxException {
        log.debug("REST request to save PaypalCompletedPayments : {}", paypalCompletedPayments);
        if (paypalCompletedPayments.getId() != null) {
            throw new BadRequestAlertException("A new paypalCompletedPayments cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PaypalCompletedPayments result = paypalCompletedPaymentsRepository.save(paypalCompletedPayments);
        paypalCompletedPaymentsSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/paypal-completed-payments/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /paypal-completed-payments : Updates an existing paypalCompletedPayments.
     *
     * @param paypalCompletedPayments the paypalCompletedPayments to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated paypalCompletedPayments,
     * or with status 400 (Bad Request) if the paypalCompletedPayments is not valid,
     * or with status 500 (Internal Server Error) if the paypalCompletedPayments couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/paypal-completed-payments")
    public ResponseEntity<PaypalCompletedPayments> updatePaypalCompletedPayments(@Valid @RequestBody PaypalCompletedPayments paypalCompletedPayments) throws URISyntaxException {
        log.debug("REST request to update PaypalCompletedPayments : {}", paypalCompletedPayments);
        if (paypalCompletedPayments.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        PaypalCompletedPayments result = paypalCompletedPaymentsRepository.save(paypalCompletedPayments);
        paypalCompletedPaymentsSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, paypalCompletedPayments.getId().toString()))
            .body(result);
    }

    /**
     * GET  /paypal-completed-payments : get all the paypalCompletedPayments.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of paypalCompletedPayments in body
     */
    @GetMapping("/paypal-completed-payments")
    public List<PaypalCompletedPayments> getAllPaypalCompletedPayments() {
        log.debug("REST request to get all PaypalCompletedPayments");
        return paypalCompletedPaymentsRepository.findAll();
    }

    /**
     * GET  /paypal-completed-payments/:id : get the "id" paypalCompletedPayments.
     *
     * @param id the id of the paypalCompletedPayments to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the paypalCompletedPayments, or with status 404 (Not Found)
     */
    @GetMapping("/paypal-completed-payments/{id}")
    public ResponseEntity<PaypalCompletedPayments> getPaypalCompletedPayments(@PathVariable Long id) {
        log.debug("REST request to get PaypalCompletedPayments : {}", id);
        Optional<PaypalCompletedPayments> paypalCompletedPayments = paypalCompletedPaymentsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(paypalCompletedPayments);
    }

    /**
     * DELETE  /paypal-completed-payments/:id : delete the "id" paypalCompletedPayments.
     *
     * @param id the id of the paypalCompletedPayments to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/paypal-completed-payments/{id}")
    public ResponseEntity<Void> deletePaypalCompletedPayments(@PathVariable Long id) {
        log.debug("REST request to delete PaypalCompletedPayments : {}", id);
        paypalCompletedPaymentsRepository.deleteById(id);
        paypalCompletedPaymentsSearchRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/paypal-completed-payments?query=:query : search for the paypalCompletedPayments corresponding
     * to the query.
     *
     * @param query the query of the paypalCompletedPayments search
     * @return the result of the search
     */
    @GetMapping("/_search/paypal-completed-payments")
    public List<PaypalCompletedPayments> searchPaypalCompletedPayments(@RequestParam String query) {
        log.debug("REST request to search PaypalCompletedPayments for query {}", query);
        return StreamSupport
            .stream(paypalCompletedPaymentsSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
