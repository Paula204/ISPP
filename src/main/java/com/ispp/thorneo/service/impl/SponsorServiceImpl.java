package com.ispp.thorneo.service.impl;

import com.ispp.thorneo.service.SponsorService;
import com.ispp.thorneo.domain.Sponsor;
import com.ispp.thorneo.repository.SponsorRepository;
import com.ispp.thorneo.repository.search.SponsorSearchRepository;
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
 * Service Implementation for managing Sponsor.
 */
@Service
@Transactional
public class SponsorServiceImpl implements SponsorService {

    private final Logger log = LoggerFactory.getLogger(SponsorServiceImpl.class);

    private final SponsorRepository sponsorRepository;

    private final SponsorSearchRepository sponsorSearchRepository;

    public SponsorServiceImpl(SponsorRepository sponsorRepository, SponsorSearchRepository sponsorSearchRepository) {
        this.sponsorRepository = sponsorRepository;
        this.sponsorSearchRepository = sponsorSearchRepository;
    }

    /**
     * Save a sponsor.
     *
     * @param sponsor the entity to save
     * @return the persisted entity
     */
    @Override
    public Sponsor save(Sponsor sponsor) {
        log.debug("Request to save Sponsor : {}", sponsor);
        Sponsor result = sponsorRepository.save(sponsor);
        sponsorSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the sponsors.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<Sponsor> findAll() {
        log.debug("Request to get all Sponsors");
        return sponsorRepository.findAllWithEagerRelationships();
    }

    /**
     * Get all the Sponsor with eager load of many-to-many relationships.
     *
     * @return the list of entities
     */
    public Page<Sponsor> findAllWithEagerRelationships(Pageable pageable) {
        return sponsorRepository.findAllWithEagerRelationships(pageable);
    }
    

    /**
     * Get one sponsor by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Sponsor> findOne(Long id) {
        log.debug("Request to get Sponsor : {}", id);
        return sponsorRepository.findOneWithEagerRelationships(id);
    }

    /**
     * Delete the sponsor by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Sponsor : {}", id);        sponsorRepository.deleteById(id);
        sponsorSearchRepository.deleteById(id);
    }

    /**
     * Search for the sponsor corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<Sponsor> search(String query) {
        log.debug("Request to search Sponsors for query {}", query);
        return StreamSupport
            .stream(sponsorSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
