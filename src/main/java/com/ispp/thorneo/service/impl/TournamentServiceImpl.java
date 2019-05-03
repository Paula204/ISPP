package com.ispp.thorneo.service.impl;

import com.ispp.thorneo.TournamentForm;
import com.ispp.thorneo.domain.Authority;
import com.ispp.thorneo.service.ParticipationService;
import com.ispp.thorneo.service.PunctuationService;
import com.ispp.thorneo.service.TournamentService;
import com.ispp.thorneo.service.UserService;
import com.ispp.thorneo.domain.Participation;
import com.ispp.thorneo.domain.Punctuation;
import com.ispp.thorneo.domain.Tournament;
import com.ispp.thorneo.domain.User;
import com.ispp.thorneo.repository.TournamentRepository;
import com.ispp.thorneo.repository.search.TournamentSearchRepository;

import com.ispp.thorneo.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.elasticsearch.index.query.QueryBuilders.*;

import com.ispp.thorneo.service.PunctuationService;

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

    private final PunctuationService punctuationService;

    private static final Integer winnerPunctuation = 10000;

    public TournamentServiceImpl(TournamentRepository tournamentRepository, TournamentSearchRepository tournamentSearchRepository,
                                 UserService userService, ParticipationService participationService, PunctuationService punctuationService) {
        this.tournamentRepository = tournamentRepository;
        this.tournamentSearchRepository = tournamentSearchRepository;
        this.userService = userService;
        this.participationService = participationService;
        this.punctuationService = punctuationService;
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

        //Optional<Tournament> aux = tournamentRepository.findById(id);

//        Object resultQuery = tournamentRepository.getAllParticipantsByTournament(id);
//
//        Object[] result = (Object[]) resultQuery;
//        Tournament tournament = (Tournament) result[0];
//        Long participationNumber = (Long) result[1];
//
//        TournamentForm tournamentForm = new TournamentForm(aux.get(), 0L);
//        Optional<TournamentForm> result = Optional.of(tournamentForm);

//        Optional<Tournament> result = tournamentRepository.findById(id);

        return tournamentRepository.findById(id);
    }

    /**
     * Delete the tournament by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Tournament : {}", id);
        List<Punctuation> x = this.punctuationService.getPunctuationsByTournament(id);
        Tournament t = this.tournamentRepository.findById(id).get();
        Set<Participation> y = t.getParticipations();
        if (!x.isEmpty() && x != null){
        for(Punctuation p: x){
            this.punctuationService.delete(p.getId());
        }}
        if (!t.getParticipations().isEmpty()){
        for(Participation p: y){
            this.participationService.delete(p.getId());
        }}

        
        tournamentRepository.deleteById(id);
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
        Tournament persistence;
        if (tournament.getId() != null){
            persistence = this.findOne(tournament.getId()).get();
        } else {
            persistence = tournament;
        }
        Assert.notNull(tournament, "Tournament is null");

        User user = userService.getUserWithAuthorities().get();
        Assert.notNull(user, "User is null");

        User manager = tournament.getUser();

        Authority admin = new Authority();
        admin.setName("ROLE_ADMIN");

        if (manager != null && user.getId() != manager.getId() && !user.getAuthorities().contains(admin) ) {
            throw new BadRequestAlertException("Invalid user", "tournament", "idManager");
        }
        if (tournament.getMeetingDate().isBefore(Instant.now())) {
            throw new BadRequestAlertException("Invalid date", "tournament", "Future");
        }

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



        Punctuation punctuation = new Punctuation();
        punctuation.setIndex(participationResult.getUser().getId().intValue());
        punctuation.setParticipation(participationResult);
        punctuation.setPoints(0);
        punctuation.setRound(0);
        punctuation.setTournament(tournament);

        if (userId != null) {
            throw new BadRequestAlertException("Invalid user", "tournament", "idsame");
        }
        if (user.getId() == tournament.getUser().getId()) {
            throw new BadRequestAlertException("Invalid user", "tournament", "idManager");
        }

        if (getWinner(tournament.getId()) != null) {
            throw new BadRequestAlertException("Close tournament", "tournament", "closeTournament");
        }
        tournament.addParticipation(participationResult);
        result = save(tournament);
        this.punctuationService.save(punctuation);
        return result;
    }

    @Transactional(readOnly = true)
    public List<Tournament> findMyTournaments() {
        log.debug("Request to get my Tournaments");
        return tournamentRepository.findByUserIsCurrentUser();
    }

    @Override
    public String getWinner(Long id) {
        Assert.notNull(id, "id is null");

        Participation p = tournamentRepository.findWinner(id);

        if (p == null || p.getPunctuation() < winnerPunctuation || p.isDisqualify()) {
            return null;
        }
        String result = p.getUser().getLogin();

        return result;
    }

    @Override
    public Tournament closeTournament(Tournament tournament) {
        Assert.notNull(tournament, "tournament is null");

        Tournament result;

        User user = userService.getUserWithAuthorities().get();
        Assert.notNull(user, "User is null");

        List<Participation> participations = tournamentRepository.getParticipationWithMaxPunctuation(tournament.getId());

        if (participations.size() > 1) {
            throw new BadRequestAlertException("So winners", "tournament", "soWinners");
        }
        if (participations == null || participations.size() == 0) {
            throw new BadRequestAlertException("Null participants", "tournament", "noParticipants");
        }
        Participation p = participations.get(0);
        if (p.getPunctuation() >= winnerPunctuation) {
            throw new BadRequestAlertException("Close tournament", "tournament", "closeTournament");
        }

        User manager = tournament.getUser();

        Authority admin = new Authority();
        admin.setName("ROLE_ADMIN");

        if (manager != null && user.getId() != manager.getId() && !user.getAuthorities().contains(admin) ) {
            throw new BadRequestAlertException("Invalid user", "tournament", "idManager");
        }
        tournament.removeParticipation(p);
        Integer punctuation = p.getPunctuation() + winnerPunctuation;
        p.setPunctuation(punctuation);
        tournament.addParticipation(p);

        result = save(tournament);

        return result;
    }

    @Override
    public Tournament closeTournamentChooseWinner(Tournament tournament, Long id) {
        Assert.notNull(tournament, "tournament is null");

        Tournament result;

        User user = userService.getUserWithAuthorities().get();
        Assert.notNull(user, "User is null");

        Participation participant = participationService.findOne(id).get();
        if (participant.getPunctuation() >= winnerPunctuation) {
            throw new BadRequestAlertException("Close tournament", "tournament", "closeTournament");
        }

        User manager = tournament.getUser();

        Authority admin = new Authority();
        admin.setName("ROLE_ADMIN");

        if (manager != null && user.getId() != manager.getId() && !user.getAuthorities().contains(admin) ) {
            throw new BadRequestAlertException("Invalid user", "tournament", "idManager");
        }
        tournament.removeParticipation(participant);
        Integer punctuation = participant.getPunctuation() + winnerPunctuation;
        participant.setPunctuation(punctuation);
        tournament.addParticipation(participant);
        this.participationService.save(participant);
        result = save(tournament);

        return result;
    }


    @Override
    public Optional<TournamentForm> getTournament(Long id) {
        Assert.notNull(id, "id is null");

        Optional<TournamentForm> result;

        Tournament tournament = findOne(id).get();

        String winner = getWinner(id);

        TournamentForm tournamentForm = new TournamentForm(tournament, winner);

        result = Optional.of(tournamentForm);

        return result;
    }

    @Override
    public Tournament closeTournamentFinalized(Tournament tournament, Long winnerId) {
        Assert.notNull(tournament, "tournament is null");
        Assert.notNull(winnerId, "winner is null");

        Tournament result;
        User user = userService.getUserWithAuthorities(winnerId).get();
        Assert.notNull(user, "user is null");
        Set<Participation> participations = tournament.getParticipations();
        Boolean b = false;
        Participation par = new Participation();
        for (Participation p : participations){
            if (p.getUser().getId() == user.getId()){
                b = true;
                par = p;
                break;
            }
        }
        Assert.isTrue(b, "User not inscribed in tournament");

        par.setPunctuation( par.getPunctuation() + winnerPunctuation);
        this.participationService.save(par);

        tournament.getParticipations().remove(par);
        tournament.addParticipation(par);

        result = save(tournament);

        return result;
    }

    @Override
    public List<Tournament> findUserTournaments(String login) {
        List<Tournament> result;

        result = tournamentRepository.findUserTournaments(login);

        if (result == null) {
            throw new BadRequestAlertException("Invalid user", "tournament", "notFound");
        }
        return result;
    }


    public void advanceRound(Long tournamentId){
        Integer alta = punctuationService.getMaxRoundTournament(tournamentId);
        List<Punctuation> lista = punctuationService.getPuntuationsByRoundAndTournament(alta, tournamentId);
        List<Punctuation> res = new ArrayList<Punctuation>();
        boolean hayEmpate = false;
        if (lista.size() > 2){
        for(int i=0 ; i<lista.size() ; i++){
            Punctuation p3 = new Punctuation();
            if(i%2==0){
                if(i+1 < lista.size()){
                    //avance ronda max puntuacion. Crear nueva puntuacion
                    Punctuation p1 = lista.get(i);
                    Punctuation p2 = lista.get(i+1);
                    if(p1.getPoints() > p2.getPoints()){
                        p3.setIndex(p1.getIndex());
                        p3.setParticipation(p1.getParticipation());
                        p3.setPoints(0);
                        p3.setRound(p1.getRound()+1);
                        p3.setTournament(p1.getTournament());
                    }else if(p1.getPoints() < p2.getPoints()){
                        p3.setIndex(p2.getIndex());
                        p3.setParticipation(p2.getParticipation());
                        p3.setPoints(0);
                        p3.setRound(p2.getRound()+1);
                        p3.setTournament(p2.getTournament());
                    }else{
                        //no se puede empatar
                        hayEmpate = true;
                        break;
                    }
                    res.add(p3);
                }else{
                    //avance ronda por descarte
                    p3.setIndex(lista.get(i).getIndex());
                    p3.setParticipation(lista.get(i).getParticipation());
                    p3.setPoints(0);
                    p3.setRound(lista.get(i).getRound()+1);
                    p3.setTournament(lista.get(i).getTournament());
                    res.add(p3);
                }
            }
        }
        if (!hayEmpate){
            //hacer algo con la lista de rondas
            for(Punctuation p:res){
                punctuationService.save(p);
            }
            if(res.size()==1){
                this.closeTournamentChooseWinner(res.get(0).getTournament(), res.get(0).getParticipation().getId());
            }
        }
    } else {
            Punctuation p1 = lista.get(0);
            Punctuation p2 = lista.get(1);
            if (p1.getPoints() > p2.getPoints()){
                p1.getParticipation().setPunctuation(10000);
                this.participationService.save(p1.getParticipation());
            } else if (p2.getPoints() > p1.getPoints()){
                p2.getParticipation().setPunctuation(10000);
                this.participationService.save(p2.getParticipation());
            }
    }
}
}
