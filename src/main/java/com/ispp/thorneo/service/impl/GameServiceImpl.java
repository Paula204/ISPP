package com.ispp.thorneo.service.impl;

import com.ispp.thorneo.domain.Authority;
import com.ispp.thorneo.repository.UserRepository;
import com.ispp.thorneo.service.GameService;
import com.ispp.thorneo.domain.Game;
import com.ispp.thorneo.repository.GameRepository;
import com.ispp.thorneo.repository.search.GameSearchRepository;
import com.ispp.thorneo.service.UserService;
import com.ispp.thorneo.web.rest.errors.BadRequestAlertException;
import io.jsonwebtoken.lang.Assert;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing Game.
 */
@Service
@Transactional
public class GameServiceImpl implements GameService {

    private final Logger log = LoggerFactory.getLogger(GameServiceImpl.class);

    private final GameRepository gameRepository;

    private final GameSearchRepository gameSearchRepository;

    private final UserService userService;

    public GameServiceImpl(GameRepository gameRepository, GameSearchRepository gameSearchRepository, UserService userService) {
        this.gameRepository = gameRepository;
        this.gameSearchRepository = gameSearchRepository;
        this.userService = userService;
    }

    /**
     * Save a game.
     *
     * @param game the entity to save
     * @return the persisted entity
     */
    @Override
    public Game save(Game game) {
        log.debug("Request to save Game : {}", game);
        Game result = gameRepository.save(game);
        gameSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the games.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<Game> findAll() {
        log.debug("Request to get all Games");
        return gameRepository.findAll();
    }


    /**
     * Get one game by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Game> findOne(Long id) {
        log.debug("Request to get Game : {}", id);
        return gameRepository.findById(id);
    }

    /**
     * Delete the game by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        checkAdmin();
        log.debug("Request to delete Game : {}", id);        gameRepository.deleteById(id);
        gameSearchRepository.deleteById(id);
    }

    /**
     * Search for the game corresponding to the query.
     *
     * @param query the query of the search
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<Game> search(String query) {
        log.debug("Request to search Games for query {}", query);
        return StreamSupport
            .stream(gameSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

    public Game updateGame(Game game) {
        Assert.notNull(game);

        Game result;

        checkAdmin();
        result = save(game);

        return result;
    }

    private void checkAdmin() {
        Authority admin = new Authority();
        admin.setName("ROLE_ADMIN");
        Set<Authority> authorities = userService.getUserWithAuthorities().get().getAuthorities();
        if (!authorities.contains(admin)) {
            throw new BadRequestAlertException("Invalid user", "game", "notCreator");
        }
    }
}
