package com.ispp.thorneo.service.impl;

import com.ispp.thorneo.service.FreeService;
import com.ispp.thorneo.domain.Free;
import com.ispp.thorneo.repository.FreeRepository;
import com.ispp.thorneo.repository.search.FreeSearchRepository;
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
 * Service Implementation for managing Free.
 */
@Service
@Transactional
public class FreeServiceImpl implements FreeService {

    private final Logger log = LoggerFactory.getLogger(FreeServiceImpl.class);

    private final FreeRepository freeRepository;

    private final FreeSearchRepository freeSearchRepository;

    public FreeServiceImpl(FreeRepository freeRepository, FreeSearchRepository freeSearchRepository) {
        this.freeRepository = freeRepository;
        this.freeSearchRepository = freeSearchRepository;
    }

    /**
     * Save a free.
     *
     * @param free the entity to save
     * @return the persisted entity
     */
    @Override
    public Free save(Free free) {
        log.debug("Request to save Free : {}", free);
        Free result = freeRepository.save(free);
        freeSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the frees.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<Free> findAll() {
        log.debug("Request to get all Frees");
        return freeRepository.findAllWithEagerRelationships();
    }

    /**
     * Get all the Free with eager load of many-to-many relationships.
     *
     * @return the list of entities
     */
    public Page<Free> findAllWithEagerRelationships(Pageable pageable) {
        return freeRepository.findAllWithEagerRelationships(pageable);
    }
    

    /**
     * Get one free by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Free> findOne(Long id) {
        log.debug("Request to get Free : {}", id);
        return freeRepository.findOneWithEagerRelationships(id);
    }

    /**
     * Delete the free by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Free : {}", id);        freeRepository.deleteById(id);
        freeSearchRepository.deleteById(id);
    }

    /**
     * Search for the free corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<Free> search(String query) {
        log.debug("Request to search Frees for query {}", query);
        return StreamSupport
            .stream(freeSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
