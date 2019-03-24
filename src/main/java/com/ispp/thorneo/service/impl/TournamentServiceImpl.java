package com.ispp.thorneo.service.impl;

import com.ispp.thorneo.service.ParticipationService;
import com.ispp.thorneo.service.TournamentService;
import com.ispp.thorneo.service.UserService;
import com.ispp.thorneo.domain.Participation;
import com.ispp.thorneo.domain.Tournament;
import com.ispp.thorneo.domain.User;
import com.ispp.thorneo.repository.TournamentRepository;
import com.ispp.thorneo.repository.UserRepository;
import com.ispp.thorneo.repository.search.TournamentSearchRepository;
import com.ispp.thorneo.security.SecurityUtils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.util.HashSet;
import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing Tournament.
 */
@Service
@Transactional
public class TournamentServiceImpl implements TournamentService {

    private final Logger log = LoggerFactory.getLogger(TournamentServiceImpl.class);

    private final TournamentRepository tournamentRepository;

    private final TournamentSearchRepository tournamentSearchRepository;

    private final UserService userService;

    private final ParticipationService participationService;

    public TournamentServiceImpl(TournamentRepository tournamentRepository, TournamentSearchRepository tournamentSearchRepository,
        UserService userService, ParticipationService participationService) {
        this.tournamentRepository = tournamentRepository;
        this.tournamentSearchRepository = tournamentSearchRepository;
        this.userService = userService;
        this.participationService = participationService;
    }

    /**
     * Save a tournament.
     *
     * @param tournament the entity to save
     * @return the persisted entity
     */
    @Override
    public Tournament save(Tournament tournament) {
        log.debug("Request to save Tournament : {}", tournament);
        Tournament result = tournamentRepository.save(tournament);
        tournamentSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the tournaments.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Tournament> findAll(Pageable pageable) {
        log.debug("Request to get all Tournaments");
        return tournamentRepository.findAll(pageable);
    }


    /**
     * Get one tournament by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Tournament> findOne(Long id) {
        log.debug("Request to get Tournament : {}", id);

        Optional<Tournament> result = tournamentRepository.findById(id);

        return result;
    }

    /**
     * Delete the tournament by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Tournament : {}", id);        tournamentRepository.deleteById(id);
        tournamentSearchRepository.deleteById(id);
    }

    /**
     * Search for the tournament corresponding to the query.
     *
     * @param query the query of the search
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Tournament> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Tournaments for query {}", query);
        return tournamentSearchRepository.search(queryStringQuery(query), pageable);    }

    @Override
    public Tournament saveTournament(Tournament tournament) {
        Tournament result;

        Assert.notNull(tournament, "Tournament is null");
        
        User user = userService.getUserWithAuthorities().get();
        Assert.notNull(user, "User is null");

        tournament.setUser(user);

        result = save(tournament);

        return result;
    }

    @Override
    public Tournament signOn(Tournament tournament) {
        Tournament result;

        Assert.notNull(tournament, "Tournament is null");
        
        User user = userService.getUserWithAuthorities().get();
        Assert.notNull(user, "User is null");

        Participation participation = new Participation();
        participation.setDisqualify(false);
        participation.setPunctuation(0);
        participation.setUser(user);
        Participation participationResult = participationService.save(participation);

        Long userId = this.tournamentRepository.findCurrentUserParticipation(tournament.getId());
        log.debug("User id participation : {}", userId);
        Assert.isTrue(userId == null, "User is sign on this tournament");

        tournament.getParticipations().add(participationResult);
//        tournament.addParticipation(participationResult);
        result = save(tournament);
        
        return result;
    }
}
