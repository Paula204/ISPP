package com.ispp.thorneo.service.impl;

import com.ispp.thorneo.service.PremiumService;
import com.ispp.thorneo.domain.Premium;
import com.ispp.thorneo.repository.PremiumRepository;
import com.ispp.thorneo.repository.search.PremiumSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing Premium.
 */
@Service
@Transactional
public class PremiumServiceImpl implements PremiumService {

    private final Logger log = LoggerFactory.getLogger(PremiumServiceImpl.class);

    private final PremiumRepository premiumRepository;

    private final PremiumSearchRepository premiumSearchRepository;

    public PremiumServiceImpl(PremiumRepository premiumRepository, PremiumSearchRepository premiumSearchRepository) {
        this.premiumRepository = premiumRepository;
        this.premiumSearchRepository = premiumSearchRepository;
    }

    /**
     * Save a premium.
     *
     * @param premium the entity to save
     * @return the persisted entity
     */
    @Override
    public Premium save(Premium premium) {
        log.debug("Request to save Premium : {}", premium);
        Premium result = premiumRepository.save(premium);
        premiumSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the premiums.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<Premium> findAll() {
        log.debug("Request to get all Premiums");
        return premiumRepository.findAllWithEagerRelationships();
    }

    /**
     * Get all the Premium with eager load of many-to-many relationships.
     *
     * @return the list of entities
     */
    public Page<Premium> findAllWithEagerRelationships(Pageable pageable) {
        return premiumRepository.findAllWithEagerRelationships(pageable);
    }
    

    /**
     * Get one premium by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Premium> findOne(Long id) {
        log.debug("Request to get Premium : {}", id);
        return premiumRepository.findOneWithEagerRelationships(id);
    }

    /**
     * Delete the premium by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Premium : {}", id);        premiumRepository.deleteById(id);
        premiumSearchRepository.deleteById(id);
    }

    /**
     * Search for the premium corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<Premium> search(String query) {
        log.debug("Request to search Premiums for query {}", query);
        return StreamSupport
            .stream(premiumSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
