package com.ispp.thorneo.service.impl;

import com.ispp.thorneo.service.PunctuationService;
import com.ispp.thorneo.domain.Punctuation;
import com.ispp.thorneo.repository.PunctuationRepository;
import com.ispp.thorneo.repository.search.PunctuationSearchRepository;
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
 * Service Implementation for managing Punctuation.
 */
@Service
@Transactional
public class PunctuationServiceImpl implements PunctuationService {

    private final Logger log = LoggerFactory.getLogger(PunctuationServiceImpl.class);

    private final PunctuationRepository punctuationRepository;

    private final PunctuationSearchRepository punctuationSearchRepository;

    public PunctuationServiceImpl(PunctuationRepository punctuationRepository,
     PunctuationSearchRepository punctuationSearchRepository) {
        this.punctuationRepository = punctuationRepository;
        this.punctuationSearchRepository = punctuationSearchRepository;
    }

    /**
     * Save a punctuation.
     *
     * @param punctuation the entity to save
     * @return the persisted entity
     */
    @Override
    public Punctuation save(Punctuation punctuation) {
        log.debug("Request to save Punctuation : {}", punctuation);
        Punctuation result = punctuationRepository.save(punctuation);
        punctuationSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the punctuations.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<Punctuation> findAll() {
        log.debug("Request to get all Punctuations");
        return punctuationRepository.findAll();
    }


    /**
     * Get one punctuation by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Punctuation> findOne(Long id) {
        log.debug("Request to get Punctuation : {}", id);
        return punctuationRepository.findById(id);
    }

    /**
     * Delete the punctuation by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Punctuation : {}", id);
        punctuationRepository.deleteById(id);
        punctuationSearchRepository.deleteById(id);
    }

    /**
     * Search for the punctuation corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<Punctuation> search(String query) {
        log.debug("Request to search Punctuations for query {}", query);
        return StreamSupport
            .stream(punctuationSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

    @Override
    public List<Punctuation> getPunctuationsByTournament(Long tournamentId) {
        return punctuationRepository.getPunctuationsByTournament(tournamentId);
    }

    @Override
    public Integer getMaxRoundTournament(Long tournamentId) {
        return punctuationRepository.getMaxRoundTournament(tournamentId);
    }

    @Override
    public List<Punctuation> getPuntuationsByRoundAndTournament(Integer round, Long tournamentId) {
        return punctuationRepository.getPuntuationsByRoundAndTournament(round, tournamentId);
    }
}
