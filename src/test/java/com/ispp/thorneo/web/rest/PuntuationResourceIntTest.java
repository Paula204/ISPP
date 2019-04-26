package com.ispp.thorneo.web.rest;

import com.ispp.thorneo.ThorneoApp;

import com.ispp.thorneo.domain.Puntuation;
import com.ispp.thorneo.domain.Tournament;
import com.ispp.thorneo.domain.Participation;
import com.ispp.thorneo.repository.PuntuationRepository;
import com.ispp.thorneo.repository.search.PuntuationSearchRepository;
import com.ispp.thorneo.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.Collections;
import java.util.List;


import static com.ispp.thorneo.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the PuntuationResource REST controller.
 *
 * @see PuntuationResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ThorneoApp.class)
public class PuntuationResourceIntTest {

    private static final Integer DEFAULT_INDEX = 0;
    private static final Integer UPDATED_INDEX = 1;

    private static final Integer DEFAULT_POINTS = 0;
    private static final Integer UPDATED_POINTS = 1;

    private static final Integer DEFAULT_ROUND = 0;
    private static final Integer UPDATED_ROUND = 1;

    @Autowired
    private PuntuationRepository puntuationRepository;

    /**
     * This repository is mocked in the com.ispp.thorneo.repository.search test package.
     *
     * @see com.ispp.thorneo.repository.search.PuntuationSearchRepositoryMockConfiguration
     */
    @Autowired
    private PuntuationSearchRepository mockPuntuationSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restPuntuationMockMvc;

    private Puntuation puntuation;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final PuntuationResource puntuationResource = new PuntuationResource(puntuationRepository, mockPuntuationSearchRepository);
        this.restPuntuationMockMvc = MockMvcBuilders.standaloneSetup(puntuationResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Puntuation createEntity(EntityManager em) {
        Puntuation puntuation = new Puntuation()
            .index(DEFAULT_INDEX)
            .points(DEFAULT_POINTS)
            .round(DEFAULT_ROUND);
        // Add required entity
        Tournament tournament = TournamentResourceIntTest.createEntity(em);
        em.persist(tournament);
        em.flush();
        puntuation.setTournament(tournament);
        // Add required entity
        Participation participation = ParticipationResourceIntTest.createEntity(em);
        em.persist(participation);
        em.flush();
        puntuation.setParticipation(participation);
        return puntuation;
    }

    @Before
    public void initTest() {
        puntuation = createEntity(em);
    }

    @Test
    @Transactional
    public void createPuntuation() throws Exception {
        int databaseSizeBeforeCreate = puntuationRepository.findAll().size();

        // Create the Puntuation
        restPuntuationMockMvc.perform(post("/api/puntuations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(puntuation)))
            .andExpect(status().isCreated());

        // Validate the Puntuation in the database
        List<Puntuation> puntuationList = puntuationRepository.findAll();
        assertThat(puntuationList).hasSize(databaseSizeBeforeCreate + 1);
        Puntuation testPuntuation = puntuationList.get(puntuationList.size() - 1);
        assertThat(testPuntuation.getIndex()).isEqualTo(DEFAULT_INDEX);
        assertThat(testPuntuation.getPoints()).isEqualTo(DEFAULT_POINTS);
        assertThat(testPuntuation.getRound()).isEqualTo(DEFAULT_ROUND);

        // Validate the Puntuation in Elasticsearch
        verify(mockPuntuationSearchRepository, times(1)).save(testPuntuation);
    }

    @Test
    @Transactional
    public void createPuntuationWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = puntuationRepository.findAll().size();

        // Create the Puntuation with an existing ID
        puntuation.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPuntuationMockMvc.perform(post("/api/puntuations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(puntuation)))
            .andExpect(status().isBadRequest());

        // Validate the Puntuation in the database
        List<Puntuation> puntuationList = puntuationRepository.findAll();
        assertThat(puntuationList).hasSize(databaseSizeBeforeCreate);

        // Validate the Puntuation in Elasticsearch
        verify(mockPuntuationSearchRepository, times(0)).save(puntuation);
    }

    @Test
    @Transactional
    public void checkIndexIsRequired() throws Exception {
        int databaseSizeBeforeTest = puntuationRepository.findAll().size();
        // set the field null
        puntuation.setIndex(null);

        // Create the Puntuation, which fails.

        restPuntuationMockMvc.perform(post("/api/puntuations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(puntuation)))
            .andExpect(status().isBadRequest());

        List<Puntuation> puntuationList = puntuationRepository.findAll();
        assertThat(puntuationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkPointsIsRequired() throws Exception {
        int databaseSizeBeforeTest = puntuationRepository.findAll().size();
        // set the field null
        puntuation.setPoints(null);

        // Create the Puntuation, which fails.

        restPuntuationMockMvc.perform(post("/api/puntuations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(puntuation)))
            .andExpect(status().isBadRequest());

        List<Puntuation> puntuationList = puntuationRepository.findAll();
        assertThat(puntuationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkRoundIsRequired() throws Exception {
        int databaseSizeBeforeTest = puntuationRepository.findAll().size();
        // set the field null
        puntuation.setRound(null);

        // Create the Puntuation, which fails.

        restPuntuationMockMvc.perform(post("/api/puntuations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(puntuation)))
            .andExpect(status().isBadRequest());

        List<Puntuation> puntuationList = puntuationRepository.findAll();
        assertThat(puntuationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllPuntuations() throws Exception {
        // Initialize the database
        puntuationRepository.saveAndFlush(puntuation);

        // Get all the puntuationList
        restPuntuationMockMvc.perform(get("/api/puntuations?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(puntuation.getId().intValue())))
            .andExpect(jsonPath("$.[*].index").value(hasItem(DEFAULT_INDEX)))
            .andExpect(jsonPath("$.[*].points").value(hasItem(DEFAULT_POINTS)))
            .andExpect(jsonPath("$.[*].round").value(hasItem(DEFAULT_ROUND)));
    }
    
    @Test
    @Transactional
    public void getPuntuation() throws Exception {
        // Initialize the database
        puntuationRepository.saveAndFlush(puntuation);

        // Get the puntuation
        restPuntuationMockMvc.perform(get("/api/puntuations/{id}", puntuation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(puntuation.getId().intValue()))
            .andExpect(jsonPath("$.index").value(DEFAULT_INDEX))
            .andExpect(jsonPath("$.points").value(DEFAULT_POINTS))
            .andExpect(jsonPath("$.round").value(DEFAULT_ROUND));
    }

    @Test
    @Transactional
    public void getNonExistingPuntuation() throws Exception {
        // Get the puntuation
        restPuntuationMockMvc.perform(get("/api/puntuations/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePuntuation() throws Exception {
        // Initialize the database
        puntuationRepository.saveAndFlush(puntuation);

        int databaseSizeBeforeUpdate = puntuationRepository.findAll().size();

        // Update the puntuation
        Puntuation updatedPuntuation = puntuationRepository.findById(puntuation.getId()).get();
        // Disconnect from session so that the updates on updatedPuntuation are not directly saved in db
        em.detach(updatedPuntuation);
        updatedPuntuation
            .index(UPDATED_INDEX)
            .points(UPDATED_POINTS)
            .round(UPDATED_ROUND);

        restPuntuationMockMvc.perform(put("/api/puntuations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedPuntuation)))
            .andExpect(status().isOk());

        // Validate the Puntuation in the database
        List<Puntuation> puntuationList = puntuationRepository.findAll();
        assertThat(puntuationList).hasSize(databaseSizeBeforeUpdate);
        Puntuation testPuntuation = puntuationList.get(puntuationList.size() - 1);
        assertThat(testPuntuation.getIndex()).isEqualTo(UPDATED_INDEX);
        assertThat(testPuntuation.getPoints()).isEqualTo(UPDATED_POINTS);
        assertThat(testPuntuation.getRound()).isEqualTo(UPDATED_ROUND);

        // Validate the Puntuation in Elasticsearch
        verify(mockPuntuationSearchRepository, times(1)).save(testPuntuation);
    }

    @Test
    @Transactional
    public void updateNonExistingPuntuation() throws Exception {
        int databaseSizeBeforeUpdate = puntuationRepository.findAll().size();

        // Create the Puntuation

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPuntuationMockMvc.perform(put("/api/puntuations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(puntuation)))
            .andExpect(status().isBadRequest());

        // Validate the Puntuation in the database
        List<Puntuation> puntuationList = puntuationRepository.findAll();
        assertThat(puntuationList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Puntuation in Elasticsearch
        verify(mockPuntuationSearchRepository, times(0)).save(puntuation);
    }

    @Test
    @Transactional
    public void deletePuntuation() throws Exception {
        // Initialize the database
        puntuationRepository.saveAndFlush(puntuation);

        int databaseSizeBeforeDelete = puntuationRepository.findAll().size();

        // Delete the puntuation
        restPuntuationMockMvc.perform(delete("/api/puntuations/{id}", puntuation.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Puntuation> puntuationList = puntuationRepository.findAll();
        assertThat(puntuationList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Puntuation in Elasticsearch
        verify(mockPuntuationSearchRepository, times(1)).deleteById(puntuation.getId());
    }

    @Test
    @Transactional
    public void searchPuntuation() throws Exception {
        // Initialize the database
        puntuationRepository.saveAndFlush(puntuation);
        when(mockPuntuationSearchRepository.search(queryStringQuery("id:" + puntuation.getId())))
            .thenReturn(Collections.singletonList(puntuation));
        // Search the puntuation
        restPuntuationMockMvc.perform(get("/api/_search/puntuations?query=id:" + puntuation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(puntuation.getId().intValue())))
            .andExpect(jsonPath("$.[*].index").value(hasItem(DEFAULT_INDEX)))
            .andExpect(jsonPath("$.[*].points").value(hasItem(DEFAULT_POINTS)))
            .andExpect(jsonPath("$.[*].round").value(hasItem(DEFAULT_ROUND)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Puntuation.class);
        Puntuation puntuation1 = new Puntuation();
        puntuation1.setId(1L);
        Puntuation puntuation2 = new Puntuation();
        puntuation2.setId(puntuation1.getId());
        assertThat(puntuation1).isEqualTo(puntuation2);
        puntuation2.setId(2L);
        assertThat(puntuation1).isNotEqualTo(puntuation2);
        puntuation1.setId(null);
        assertThat(puntuation1).isNotEqualTo(puntuation2);
    }
}
