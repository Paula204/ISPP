package com.ispp.thorneo.web.rest;
import com.ispp.thorneo.domain.Promotion;
import com.ispp.thorneo.repository.PromotionRepository;
import com.ispp.thorneo.repository.search.PromotionSearchRepository;
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
 * REST controller for managing Promotion.
 */
@RestController
@RequestMapping("/api")
public class PromotionResource {

    private final Logger log = LoggerFactory.getLogger(PromotionResource.class);

    private static final String ENTITY_NAME = "promotion";

    private final PromotionRepository promotionRepository;

    private final PromotionSearchRepository promotionSearchRepository;

    public PromotionResource(PromotionRepository promotionRepository, PromotionSearchRepository promotionSearchRepository) {
        this.promotionRepository = promotionRepository;
        this.promotionSearchRepository = promotionSearchRepository;
    }

    /**
     * POST  /promotions : Create a new promotion.
     *
     * @param promotion the promotion to create
     * @return the ResponseEntity with status 201 (Created) and with body the new promotion, or with status 400 (Bad Request) if the promotion has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/promotions")
    public ResponseEntity<Promotion> createPromotion(@Valid @RequestBody Promotion promotion) throws URISyntaxException {
        log.debug("REST request to save Promotion : {}", promotion);
        if (promotion.getId() != null) {
            throw new BadRequestAlertException("A new promotion cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Promotion result = promotionRepository.save(promotion);
        promotionSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/promotions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /promotions : Updates an existing promotion.
     *
     * @param promotion the promotion to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated promotion,
     * or with status 400 (Bad Request) if the promotion is not valid,
     * or with status 500 (Internal Server Error) if the promotion couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/promotions")
    public ResponseEntity<Promotion> updatePromotion(@Valid @RequestBody Promotion promotion) throws URISyntaxException {
        log.debug("REST request to update Promotion : {}", promotion);
        if (promotion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Promotion result = promotionRepository.save(promotion);
        promotionSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, promotion.getId().toString()))
            .body(result);
    }

    /**
     * GET  /promotions : get all the promotions.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of promotions in body
     */
    @GetMapping("/promotions")
    public List<Promotion> getAllPromotions() {
        log.debug("REST request to get all Promotions");
        return promotionRepository.findAll();
    }

    /**
     * GET  /promotions/:id : get the "id" promotion.
     *
     * @param id the id of the promotion to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the promotion, or with status 404 (Not Found)
     */
    @GetMapping("/promotions/{id}")
    public ResponseEntity<Promotion> getPromotion(@PathVariable Long id) {
        log.debug("REST request to get Promotion : {}", id);
        Optional<Promotion> promotion = promotionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(promotion);
    }

    /**
     * DELETE  /promotions/:id : delete the "id" promotion.
     *
     * @param id the id of the promotion to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/promotions/{id}")
    public ResponseEntity<Void> deletePromotion(@PathVariable Long id) {
        log.debug("REST request to delete Promotion : {}", id);
        promotionRepository.deleteById(id);
        promotionSearchRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/promotions?query=:query : search for the promotion corresponding
     * to the query.
     *
     * @param query the query of the promotion search
     * @return the result of the search
     */
    @GetMapping("/_search/promotions")
    public List<Promotion> searchPromotions(@RequestParam String query) {
        log.debug("REST request to search Promotions for query {}", query);
        return StreamSupport
            .stream(promotionSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
