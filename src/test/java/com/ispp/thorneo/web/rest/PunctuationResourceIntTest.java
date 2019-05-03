package com.ispp.thorneo.web.rest;

import com.ispp.thorneo.ThorneoApp;

import com.ispp.thorneo.domain.Punctuation;
import com.ispp.thorneo.domain.Tournament;
import com.ispp.thorneo.domain.Participation;
import com.ispp.thorneo.repository.PunctuationRepository;
import com.ispp.thorneo.repository.search.PunctuationSearchRepository;
import com.ispp.thorneo.service.PunctuationService;
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
 * Test class for the PunctuationResource REST controller.
 *
 * @see PunctuationResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ThorneoApp.class)
public class PunctuationResourceIntTest {

    private static final Integer DEFAULT_INDEX = 0;
    private static final Integer UPDATED_INDEX = 1;

    private static final Integer DEFAULT_POINTS = 0;
    private static final Integer UPDATED_POINTS = 1;

    private static final Integer DEFAULT_ROUND = 0;
    private static final Integer UPDATED_ROUND = 1;

    @Autowired
    private PunctuationRepository punctuationRepository;

    @Autowired
    private PunctuationService punctuationService;

    /**
     * This repository is mocked in the com.ispp.thorneo.repository.search test package.
     *
     * @see com.ispp.thorneo.repository.search.PunctuationSearchRepositoryMockConfiguration
     */
    @Autowired
    private PunctuationSearchRepository mockPunctuationSearchRepository;

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

    private MockMvc restPunctuationMockMvc;

    private Punctuation punctuation;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final PunctuationResource punctuationResource = new PunctuationResource(punctuationService);
        this.restPunctuationMockMvc = MockMvcBuilders.standaloneSetup(punctuationResource)
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
    public static Punctuation createEntity(EntityManager em) {
        Punctuation punctuation = new Punctuation()
            .index(DEFAULT_INDEX)
            .points(DEFAULT_POINTS)
            .round(DEFAULT_ROUND);
        // Add required entity
        Tournament tournament = TournamentResourceIntTest.createEntity(em);
        em.persist(tournament);
        em.flush();
        punctuation.setTournament(tournament);
        // Add required entity
        Participation participation = ParticipationResourceIntTest.createEntity(em);
        em.persist(participation);
        em.flush();
        punctuation.setParticipation(participation);
        return punctuation;
    }

    @Before
    public void initTest() {
        punctuation = createEntity(em);
    }

    @Test
    @Transactional
    public void createPunctuation() throws Exception {
        int databaseSizeBeforeCreate = punctuationRepository.findAll().size();

        // Create the Punctuation
        restPunctuationMockMvc.perform(post("/api/punctuations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(punctuation)))
            .andExpect(status().isCreated());

        // Validate the Punctuation in the database
        List<Punctuation> punctuationList = punctuationRepository.findAll();
        assertThat(punctuationList).hasSize(databaseSizeBeforeCreate + 1);
        Punctuation testPunctuation = punctuationList.get(punctuationList.size() - 1);
        assertThat(testPunctuation.getIndex()).isEqualTo(DEFAULT_INDEX);
        assertThat(testPunctuation.getPoints()).isEqualTo(DEFAULT_POINTS);
        assertThat(testPunctuation.getRound()).isEqualTo(DEFAULT_ROUND);

        // Validate the Punctuation in Elasticsearch
        verify(mockPunctuationSearchRepository, times(1)).save(testPunctuation);
    }

    @Test
    @Transactional
    public void createPunctuationWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = punctuationRepository.findAll().size();

        // Create the Punctuation with an existing ID
        punctuation.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPunctuationMockMvc.perform(post("/api/punctuations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(punctuation)))
            .andExpect(status().isBadRequest());

        // Validate the Punctuation in the database
        List<Punctuation> punctuationList = punctuationRepository.findAll();
        assertThat(punctuationList).hasSize(databaseSizeBeforeCreate);

        // Validate the Punctuation in Elasticsearch
        verify(mockPunctuationSearchRepository, times(0)).save(punctuation);
    }

    @Test
    @Transactional
    public void checkIndexIsRequired() throws Exception {
        int databaseSizeBeforeTest = punctuationRepository.findAll().size();
        // set the field null
        punctuation.setIndex(null);

        // Create the Punctuation, which fails.

        restPunctuationMockMvc.perform(post("/api/punctuations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(punctuation)))
            .andExpect(status().isBadRequest());

        List<Punctuation> punctuationList = punctuationRepository.findAll();
        assertThat(punctuationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkPointsIsRequired() throws Exception {
        int databaseSizeBeforeTest = punctuationRepository.findAll().size();
        // set the field null
        punctuation.setPoints(null);

        // Create the Punctuation, which fails.

        restPunctuationMockMvc.perform(post("/api/punctuations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(punctuation)))
            .andExpect(status().isBadRequest());

        List<Punctuation> punctuationList = punctuationRepository.findAll();
        assertThat(punctuationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkRoundIsRequired() throws Exception {
        int databaseSizeBeforeTest = punctuationRepository.findAll().size();
        // set the field null
        punctuation.setRound(null);

        // Create the Punctuation, which fails.

        restPunctuationMockMvc.perform(post("/api/punctuations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(punctuation)))
            .andExpect(status().isBadRequest());

        List<Punctuation> punctuationList = punctuationRepository.findAll();
        assertThat(punctuationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllPunctuations() throws Exception {
        // Initialize the database
        punctuationRepository.saveAndFlush(punctuation);

        // Get all the punctuationList
        restPunctuationMockMvc.perform(get("/api/punctuations?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(punctuation.getId().intValue())))
            .andExpect(jsonPath("$.[*].index").value(hasItem(DEFAULT_INDEX)))
            .andExpect(jsonPath("$.[*].points").value(hasItem(DEFAULT_POINTS)))
            .andExpect(jsonPath("$.[*].round").value(hasItem(DEFAULT_ROUND)));
    }
    
    @Test
    @Transactional
    public void getPunctuation() throws Exception {
        // Initialize the database
        punctuationRepository.saveAndFlush(punctuation);

        // Get the punctuation
        restPunctuationMockMvc.perform(get("/api/punctuations/{id}", punctuation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(punctuation.getId().intValue()))
            .andExpect(jsonPath("$.index").value(DEFAULT_INDEX))
            .andExpect(jsonPath("$.points").value(DEFAULT_POINTS))
            .andExpect(jsonPath("$.round").value(DEFAULT_ROUND));
    }

    @Test
    @Transactional
    public void getNonExistingPunctuation() throws Exception {
        // Get the punctuation
        restPunctuationMockMvc.perform(get("/api/punctuations/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePunctuation() throws Exception {
        // Initialize the database
        punctuationService.save(punctuation);
        // As the test used the service layer, reset the Elasticsearch mock repository
        reset(mockPunctuationSearchRepository);

        int databaseSizeBeforeUpdate = punctuationRepository.findAll().size();

        // Update the punctuation
        Punctuation updatedPunctuation = punctuationRepository.findById(punctuation.getId()).get();
        // Disconnect from session so that the updates on updatedPunctuation are not directly saved in db
        em.detach(updatedPunctuation);
        updatedPunctuation
            .index(UPDATED_INDEX)
            .points(UPDATED_POINTS)
            .round(UPDATED_ROUND);

        restPunctuationMockMvc.perform(put("/api/punctuations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedPunctuation)))
            .andExpect(status().isOk());

        // Validate the Punctuation in the database
        List<Punctuation> punctuationList = punctuationRepository.findAll();
        assertThat(punctuationList).hasSize(databaseSizeBeforeUpdate);
        Punctuation testPunctuation = punctuationList.get(punctuationList.size() - 1);
        assertThat(testPunctuation.getIndex()).isEqualTo(UPDATED_INDEX);
        assertThat(testPunctuation.getPoints()).isEqualTo(UPDATED_POINTS);
        assertThat(testPunctuation.getRound()).isEqualTo(UPDATED_ROUND);

        // Validate the Punctuation in Elasticsearch
        verify(mockPunctuationSearchRepository, times(1)).save(testPunctuation);
    }

    @Test
    @Transactional
    public void updateNonExistingPunctuation() throws Exception {
        int databaseSizeBeforeUpdate = punctuationRepository.findAll().size();

        // Create the Punctuation

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPunctuationMockMvc.perform(put("/api/punctuations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(punctuation)))
            .andExpect(status().isBadRequest());

        // Validate the Punctuation in the database
        List<Punctuation> punctuationList = punctuationRepository.findAll();
        assertThat(punctuationList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Punctuation in Elasticsearch
        verify(mockPunctuationSearchRepository, times(0)).save(punctuation);
    }

    @Test
    @Transactional
    public void deletePunctuation() throws Exception {
        // Initialize the database
        punctuationService.save(punctuation);

        int databaseSizeBeforeDelete = punctuationRepository.findAll().size();

        // Delete the punctuation
        restPunctuationMockMvc.perform(delete("/api/punctuations/{id}", punctuation.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Punctuation> punctuationList = punctuationRepository.findAll();
        assertThat(punctuationList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Punctuation in Elasticsearch
        verify(mockPunctuationSearchRepository, times(1)).deleteById(punctuation.getId());
    }

    @Test
    @Transactional
    public void searchPunctuation() throws Exception {
        // Initialize the database
        punctuationService.save(punctuation);
        when(mockPunctuationSearchRepository.search(queryStringQuery("id:" + punctuation.getId())))
            .thenReturn(Collections.singletonList(punctuation));
        // Search the punctuation
        restPunctuationMockMvc.perform(get("/api/_search/punctuations?query=id:" + punctuation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(punctuation.getId().intValue())))
            .andExpect(jsonPath("$.[*].index").value(hasItem(DEFAULT_INDEX)))
            .andExpect(jsonPath("$.[*].points").value(hasItem(DEFAULT_POINTS)))
            .andExpect(jsonPath("$.[*].round").value(hasItem(DEFAULT_ROUND)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Punctuation.class);
        Punctuation punctuation1 = new Punctuation();
        punctuation1.setId(1L);
        Punctuation punctuation2 = new Punctuation();
        punctuation2.setId(punctuation1.getId());
        assertThat(punctuation1).isEqualTo(punctuation2);
        punctuation2.setId(2L);
        assertThat(punctuation1).isNotEqualTo(punctuation2);
        punctuation1.setId(null);
        assertThat(punctuation1).isNotEqualTo(punctuation2);
    }
}
