package com.ispp.thorneo.service.impl;

import com.ispp.thorneo.service.SponsorshipService;
import com.ispp.thorneo.domain.Sponsorship;
import com.ispp.thorneo.repository.SponsorshipRepository;
import com.ispp.thorneo.repository.search.SponsorshipSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing Sponsorship.
 */
@Service
@Transactional
public class SponsorshipServiceImpl implements SponsorshipService {

    private final Logger log = LoggerFactory.getLogger(SponsorshipServiceImpl.class);

    private final SponsorshipRepository sponsorshipRepository;

    private final SponsorshipSearchRepository sponsorshipSearchRepository;

    public SponsorshipServiceImpl(SponsorshipRepository sponsorshipRepository, SponsorshipSearchRepository sponsorshipSearchRepository) {
        this.sponsorshipRepository = sponsorshipRepository;
        this.sponsorshipSearchRepository = sponsorshipSearchRepository;
    }

    /**
     * Save a sponsorship.
     *
     * @param sponsorship the entity to save
     * @return the persisted entity
     */
    @Override
    public Sponsorship save(Sponsorship sponsorship) {
        log.debug("Request to save Sponsorship : {}", sponsorship);
        Sponsorship result = sponsorshipRepository.save(sponsorship);
        sponsorshipSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the sponsorships.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Sponsorship> findAll(Pageable pageable) {
        log.debug("Request to get all Sponsorships");
        return sponsorshipRepository.findAll(pageable);
    }


    /**
     * Get one sponsorship by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Sponsorship> findOne(Long id) {
        log.debug("Request to get Sponsorship : {}", id);
        return sponsorshipRepository.findById(id);
    }

    /**
     * Delete the sponsorship by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Sponsorship : {}", id);        sponsorshipRepository.deleteById(id);
        sponsorshipSearchRepository.deleteById(id);
    }

    /**
     * Search for the sponsorship corresponding to the query.
     *
     * @param query the query of the search
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Sponsorship> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Sponsorships for query {}", query);
        return sponsorshipSearchRepository.search(queryStringQuery(query), pageable);    }
}
