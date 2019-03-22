package com.ispp.thorneo.web.rest;

import com.ispp.thorneo.ThorneoApp;

import com.ispp.thorneo.domain.Premium;
import com.ispp.thorneo.repository.PremiumRepository;
import com.ispp.thorneo.repository.search.PremiumSearchRepository;
import com.ispp.thorneo.service.PremiumService;
import com.ispp.thorneo.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.ArrayList;
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
 * Test class for the PremiumResource REST controller.
 *
 * @see PremiumResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ThorneoApp.class)
public class PremiumResourceIntTest {

    @Autowired
    private PremiumRepository premiumRepository;

    @Mock
    private PremiumRepository premiumRepositoryMock;

    @Mock
    private PremiumService premiumServiceMock;

    @Autowired
    private PremiumService premiumService;

    /**
     * This repository is mocked in the com.ispp.thorneo.repository.search test package.
     *
     * @see com.ispp.thorneo.repository.search.PremiumSearchRepositoryMockConfiguration
     */
    @Autowired
    private PremiumSearchRepository mockPremiumSearchRepository;

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

    private MockMvc restPremiumMockMvc;

    private Premium premium;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final PremiumResource premiumResource = new PremiumResource(premiumService);
        this.restPremiumMockMvc = MockMvcBuilders.standaloneSetup(premiumResource)
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
    public static Premium createEntity(EntityManager em) {
        Premium premium = new Premium();
        return premium;
    }

    @Before
    public void initTest() {
        premium = createEntity(em);
    }

    @Test
    @Transactional
    public void createPremium() throws Exception {
        int databaseSizeBeforeCreate = premiumRepository.findAll().size();

        // Create the Premium
        restPremiumMockMvc.perform(post("/api/premiums")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(premium)))
            .andExpect(status().isCreated());

        // Validate the Premium in the database
        List<Premium> premiumList = premiumRepository.findAll();
        assertThat(premiumList).hasSize(databaseSizeBeforeCreate + 1);
        Premium testPremium = premiumList.get(premiumList.size() - 1);

        // Validate the Premium in Elasticsearch
        verify(mockPremiumSearchRepository, times(1)).save(testPremium);
    }

    @Test
    @Transactional
    public void createPremiumWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = premiumRepository.findAll().size();

        // Create the Premium with an existing ID
        premium.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPremiumMockMvc.perform(post("/api/premiums")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(premium)))
            .andExpect(status().isBadRequest());

        // Validate the Premium in the database
        List<Premium> premiumList = premiumRepository.findAll();
        assertThat(premiumList).hasSize(databaseSizeBeforeCreate);

        // Validate the Premium in Elasticsearch
        verify(mockPremiumSearchRepository, times(0)).save(premium);
    }

    @Test
    @Transactional
    public void getAllPremiums() throws Exception {
        // Initialize the database
        premiumRepository.saveAndFlush(premium);

        // Get all the premiumList
        restPremiumMockMvc.perform(get("/api/premiums?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(premium.getId().intValue())));
    }
    
    @SuppressWarnings({"unchecked"})
    public void getAllPremiumsWithEagerRelationshipsIsEnabled() throws Exception {
        PremiumResource premiumResource = new PremiumResource(premiumServiceMock);
        when(premiumServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        MockMvc restPremiumMockMvc = MockMvcBuilders.standaloneSetup(premiumResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restPremiumMockMvc.perform(get("/api/premiums?eagerload=true"))
        .andExpect(status().isOk());

        verify(premiumServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({"unchecked"})
    public void getAllPremiumsWithEagerRelationshipsIsNotEnabled() throws Exception {
        PremiumResource premiumResource = new PremiumResource(premiumServiceMock);
            when(premiumServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));
            MockMvc restPremiumMockMvc = MockMvcBuilders.standaloneSetup(premiumResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restPremiumMockMvc.perform(get("/api/premiums?eagerload=true"))
        .andExpect(status().isOk());

            verify(premiumServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    public void getPremium() throws Exception {
        // Initialize the database
        premiumRepository.saveAndFlush(premium);

        // Get the premium
        restPremiumMockMvc.perform(get("/api/premiums/{id}", premium.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(premium.getId().intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingPremium() throws Exception {
        // Get the premium
        restPremiumMockMvc.perform(get("/api/premiums/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePremium() throws Exception {
        // Initialize the database
        premiumService.save(premium);
        // As the test used the service layer, reset the Elasticsearch mock repository
        reset(mockPremiumSearchRepository);

        int databaseSizeBeforeUpdate = premiumRepository.findAll().size();

        // Update the premium
        Premium updatedPremium = premiumRepository.findById(premium.getId()).get();
        // Disconnect from session so that the updates on updatedPremium are not directly saved in db
        em.detach(updatedPremium);

        restPremiumMockMvc.perform(put("/api/premiums")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedPremium)))
            .andExpect(status().isOk());

        // Validate the Premium in the database
        List<Premium> premiumList = premiumRepository.findAll();
        assertThat(premiumList).hasSize(databaseSizeBeforeUpdate);
        Premium testPremium = premiumList.get(premiumList.size() - 1);

        // Validate the Premium in Elasticsearch
        verify(mockPremiumSearchRepository, times(1)).save(testPremium);
    }

    @Test
    @Transactional
    public void updateNonExistingPremium() throws Exception {
        int databaseSizeBeforeUpdate = premiumRepository.findAll().size();

        // Create the Premium

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPremiumMockMvc.perform(put("/api/premiums")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(premium)))
            .andExpect(status().isBadRequest());

        // Validate the Premium in the database
        List<Premium> premiumList = premiumRepository.findAll();
        assertThat(premiumList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Premium in Elasticsearch
        verify(mockPremiumSearchRepository, times(0)).save(premium);
    }

    @Test
    @Transactional
    public void deletePremium() throws Exception {
        // Initialize the database
        premiumService.save(premium);

        int databaseSizeBeforeDelete = premiumRepository.findAll().size();

        // Delete the premium
        restPremiumMockMvc.perform(delete("/api/premiums/{id}", premium.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Premium> premiumList = premiumRepository.findAll();
        assertThat(premiumList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Premium in Elasticsearch
        verify(mockPremiumSearchRepository, times(1)).deleteById(premium.getId());
    }

    @Test
    @Transactional
    public void searchPremium() throws Exception {
        // Initialize the database
        premiumService.save(premium);
        when(mockPremiumSearchRepository.search(queryStringQuery("id:" + premium.getId())))
            .thenReturn(Collections.singletonList(premium));
        // Search the premium
        restPremiumMockMvc.perform(get("/api/_search/premiums?query=id:" + premium.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(premium.getId().intValue())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Premium.class);
        Premium premium1 = new Premium();
        premium1.setId(1L);
        Premium premium2 = new Premium();
        premium2.setId(premium1.getId());
        assertThat(premium1).isEqualTo(premium2);
        premium2.setId(2L);
        assertThat(premium1).isNotEqualTo(premium2);
        premium1.setId(null);
        assertThat(premium1).isNotEqualTo(premium2);
    }
}
