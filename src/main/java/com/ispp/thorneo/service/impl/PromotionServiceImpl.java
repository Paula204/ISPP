package com.ispp.thorneo.service.impl;

import com.ispp.thorneo.service.PromotionService;
import com.ispp.thorneo.domain.Promotion;
import com.ispp.thorneo.repository.PromotionRepository;
import com.ispp.thorneo.repository.search.PromotionSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing Promotion.
 */
@Service
@Transactional
public class PromotionServiceImpl implements PromotionService {

    private final Logger log = LoggerFactory.getLogger(PromotionServiceImpl.class);

    private final PromotionRepository promotionRepository;

    private final PromotionSearchRepository promotionSearchRepository;

    public PromotionServiceImpl(PromotionRepository promotionRepository, PromotionSearchRepository promotionSearchRepository) {
        this.promotionRepository = promotionRepository;
        this.promotionSearchRepository = promotionSearchRepository;
    }

    /**
     * Save a promotion.
     *
     * @param promotion the entity to save
     * @return the persisted entity
     */
    @Override
    public Promotion save(Promotion promotion) {
        log.debug("Request to save Promotion : {}", promotion);
        Promotion result = promotionRepository.save(promotion);
        promotionSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the promotions.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Promotion> findAll(Pageable pageable) {
        log.debug("Request to get all Promotions");
        return promotionRepository.findAll(pageable);
    }


    /**
     * Get one promotion by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Promotion> findOne(Long id) {
        log.debug("Request to get Promotion : {}", id);
        return promotionRepository.findById(id);
    }

    /**
     * Delete the promotion by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Promotion : {}", id);        promotionRepository.deleteById(id);
        promotionSearchRepository.deleteById(id);
    }

    /**
     * Search for the promotion corresponding to the query.
     *
     * @param query the query of the search
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Promotion> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Promotions for query {}", query);
        return promotionSearchRepository.search(queryStringQuery(query), pageable);    }
}
