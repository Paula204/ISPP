package com.ispp.thorneo.web.rest;

import com.ispp.thorneo.ThorneoApp;

import com.ispp.thorneo.domain.Clasification;
import com.ispp.thorneo.repository.ClasificationRepository;
import com.ispp.thorneo.repository.search.ClasificationSearchRepository;
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
 * Test class for the ClasificationResource REST controller.
 *
 * @see ClasificationResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ThorneoApp.class)
public class ClasificationResourceIntTest {

    private static final Integer DEFAULT_PUNCTUATION = 0;
    private static final Integer UPDATED_PUNCTUATION = 1;

    @Autowired
    private ClasificationRepository clasificationRepository;

    /**
     * This repository is mocked in the com.ispp.thorneo.repository.search test package.
     *
     * @see com.ispp.thorneo.repository.search.ClasificationSearchRepositoryMockConfiguration
     */
    @Autowired
    private ClasificationSearchRepository mockClasificationSearchRepository;

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

    private MockMvc restClasificationMockMvc;

    private Clasification clasification;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ClasificationResource clasificationResource = new ClasificationResource(clasificationRepository, mockClasificationSearchRepository);
        this.restClasificationMockMvc = MockMvcBuilders.standaloneSetup(clasificationResource)
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
    public static Clasification createEntity(EntityManager em) {
        Clasification clasification = new Clasification()
            .punctuation(DEFAULT_PUNCTUATION);
        return clasification;
    }

    @Before
    public void initTest() {
        clasification = createEntity(em);
    }

    @Test
    @Transactional
    public void createClasification() throws Exception {
        int databaseSizeBeforeCreate = clasificationRepository.findAll().size();

        // Create the Clasification
        restClasificationMockMvc.perform(post("/api/clasifications")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(clasification)))
            .andExpect(status().isCreated());

        // Validate the Clasification in the database
        List<Clasification> clasificationList = clasificationRepository.findAll();
        assertThat(clasificationList).hasSize(databaseSizeBeforeCreate + 1);
        Clasification testClasification = clasificationList.get(clasificationList.size() - 1);
        assertThat(testClasification.getPunctuation()).isEqualTo(DEFAULT_PUNCTUATION);

        // Validate the Clasification in Elasticsearch
        verify(mockClasificationSearchRepository, times(1)).save(testClasification);
    }

    @Test
    @Transactional
    public void createClasificationWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = clasificationRepository.findAll().size();

        // Create the Clasification with an existing ID
        clasification.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restClasificationMockMvc.perform(post("/api/clasifications")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(clasification)))
            .andExpect(status().isBadRequest());

        // Validate the Clasification in the database
        List<Clasification> clasificationList = clasificationRepository.findAll();
        assertThat(clasificationList).hasSize(databaseSizeBeforeCreate);

        // Validate the Clasification in Elasticsearch
        verify(mockClasificationSearchRepository, times(0)).save(clasification);
    }

    @Test
    @Transactional
    public void getAllClasifications() throws Exception {
        // Initialize the database
        clasificationRepository.saveAndFlush(clasification);

        // Get all the clasificationList
        restClasificationMockMvc.perform(get("/api/clasifications?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(clasification.getId().intValue())))
            .andExpect(jsonPath("$.[*].punctuation").value(hasItem(DEFAULT_PUNCTUATION)));
    }
    
    @Test
    @Transactional
    public void getClasification() throws Exception {
        // Initialize the database
        clasificationRepository.saveAndFlush(clasification);

        // Get the clasification
        restClasificationMockMvc.perform(get("/api/clasifications/{id}", clasification.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(clasification.getId().intValue()))
            .andExpect(jsonPath("$.punctuation").value(DEFAULT_PUNCTUATION));
    }

    @Test
    @Transactional
    public void getNonExistingClasification() throws Exception {
        // Get the clasification
        restClasificationMockMvc.perform(get("/api/clasifications/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateClasification() throws Exception {
        // Initialize the database
        clasificationRepository.saveAndFlush(clasification);

        int databaseSizeBeforeUpdate = clasificationRepository.findAll().size();

        // Update the clasification
        Clasification updatedClasification = clasificationRepository.findById(clasification.getId()).get();
        // Disconnect from session so that the updates on updatedClasification are not directly saved in db
        em.detach(updatedClasification);
        updatedClasification
            .punctuation(UPDATED_PUNCTUATION);

        restClasificationMockMvc.perform(put("/api/clasifications")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedClasification)))
            .andExpect(status().isOk());

        // Validate the Clasification in the database
        List<Clasification> clasificationList = clasificationRepository.findAll();
        assertThat(clasificationList).hasSize(databaseSizeBeforeUpdate);
        Clasification testClasification = clasificationList.get(clasificationList.size() - 1);
        assertThat(testClasification.getPunctuation()).isEqualTo(UPDATED_PUNCTUATION);

        // Validate the Clasification in Elasticsearch
        verify(mockClasificationSearchRepository, times(1)).save(testClasification);
    }

    @Test
    @Transactional
    public void updateNonExistingClasification() throws Exception {
        int databaseSizeBeforeUpdate = clasificationRepository.findAll().size();

        // Create the Clasification

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClasificationMockMvc.perform(put("/api/clasifications")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(clasification)))
            .andExpect(status().isBadRequest());

        // Validate the Clasification in the database
        List<Clasification> clasificationList = clasificationRepository.findAll();
        assertThat(clasificationList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Clasification in Elasticsearch
        verify(mockClasificationSearchRepository, times(0)).save(clasification);
    }

    @Test
    @Transactional
    public void deleteClasification() throws Exception {
        // Initialize the database
        clasificationRepository.saveAndFlush(clasification);

        int databaseSizeBeforeDelete = clasificationRepository.findAll().size();

        // Delete the clasification
        restClasificationMockMvc.perform(delete("/api/clasifications/{id}", clasification.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Clasification> clasificationList = clasificationRepository.findAll();
        assertThat(clasificationList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Clasification in Elasticsearch
        verify(mockClasificationSearchRepository, times(1)).deleteById(clasification.getId());
    }

    @Test
    @Transactional
    public void searchClasification() throws Exception {
        // Initialize the database
        clasificationRepository.saveAndFlush(clasification);
        when(mockClasificationSearchRepository.search(queryStringQuery("id:" + clasification.getId())))
            .thenReturn(Collections.singletonList(clasification));
        // Search the clasification
        restClasificationMockMvc.perform(get("/api/_search/clasifications?query=id:" + clasification.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(clasification.getId().intValue())))
            .andExpect(jsonPath("$.[*].punctuation").value(hasItem(DEFAULT_PUNCTUATION)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Clasification.class);
        Clasification clasification1 = new Clasification();
        clasification1.setId(1L);
        Clasification clasification2 = new Clasification();
        clasification2.setId(clasification1.getId());
        assertThat(clasification1).isEqualTo(clasification2);
        clasification2.setId(2L);
        assertThat(clasification1).isNotEqualTo(clasification2);
        clasification1.setId(null);
        assertThat(clasification1).isNotEqualTo(clasification2);
    }
}
