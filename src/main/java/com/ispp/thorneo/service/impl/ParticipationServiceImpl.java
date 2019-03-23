package com.ispp.thorneo.service.impl;

import com.ispp.thorneo.service.ParticipationService;
import com.ispp.thorneo.domain.Participation;
import com.ispp.thorneo.repository.ParticipationRepository;
import com.ispp.thorneo.repository.search.ParticipationSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing Participation.
 */
@Service
@Transactional
public class ParticipationServiceImpl implements ParticipationService {

    private final Logger log = LoggerFactory.getLogger(ParticipationServiceImpl.class);

    private final ParticipationRepository participationRepository;

    private final ParticipationSearchRepository participationSearchRepository;

    public ParticipationServiceImpl(ParticipationRepository participationRepository, ParticipationSearchRepository participationSearchRepository) {
        this.participationRepository = participationRepository;
        this.participationSearchRepository = participationSearchRepository;
    }

    /**
     * Save a participation.
     *
     * @param participation the entity to save
     * @return the persisted entity
     */
    @Override
    public Participation save(Participation participation) {
        log.debug("Request to save Participation : {}", participation);
        Participation result = participationRepository.save(participation);
        participationSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the participations.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<Participation> findAll() {
        log.debug("Request to get all Participations");
        return participationRepository.findAll();
    }


    /**
     * Get one participation by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Participation> findOne(Long id) {
        log.debug("Request to get Participation : {}", id);
        return participationRepository.findById(id);
    }

    /**
     * Delete the participation by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Participation : {}", id);        participationRepository.deleteById(id);
        participationSearchRepository.deleteById(id);
    }

    /**
     * Search for the participation corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<Participation> search(String query) {
        log.debug("Request to search Participations for query {}", query);
        return StreamSupport
            .stream(participationSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
