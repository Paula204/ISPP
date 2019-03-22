package com.ispp.thorneo.web.rest;

import com.ispp.thorneo.ThorneoApp;

import com.ispp.thorneo.domain.Free;
import com.ispp.thorneo.repository.FreeRepository;
import com.ispp.thorneo.repository.search.FreeSearchRepository;
import com.ispp.thorneo.service.FreeService;
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
 * Test class for the FreeResource REST controller.
 *
 * @see FreeResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ThorneoApp.class)
public class FreeResourceIntTest {

    @Autowired
    private FreeRepository freeRepository;

    @Mock
    private FreeRepository freeRepositoryMock;

    @Mock
    private FreeService freeServiceMock;

    @Autowired
    private FreeService freeService;

    /**
     * This repository is mocked in the com.ispp.thorneo.repository.search test package.
     *
     * @see com.ispp.thorneo.repository.search.FreeSearchRepositoryMockConfiguration
     */
    @Autowired
    private FreeSearchRepository mockFreeSearchRepository;

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

    private MockMvc restFreeMockMvc;

    private Free free;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final FreeResource freeResource = new FreeResource(freeService);
        this.restFreeMockMvc = MockMvcBuilders.standaloneSetup(freeResource)
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
    public static Free createEntity(EntityManager em) {
        Free free = new Free();
        return free;
    }

    @Before
    public void initTest() {
        free = createEntity(em);
    }

    @Test
    @Transactional
    public void createFree() throws Exception {
        int databaseSizeBeforeCreate = freeRepository.findAll().size();

        // Create the Free
        restFreeMockMvc.perform(post("/api/frees")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(free)))
            .andExpect(status().isCreated());

        // Validate the Free in the database
        List<Free> freeList = freeRepository.findAll();
        assertThat(freeList).hasSize(databaseSizeBeforeCreate + 1);
        Free testFree = freeList.get(freeList.size() - 1);

        // Validate the Free in Elasticsearch
        verify(mockFreeSearchRepository, times(1)).save(testFree);
    }

    @Test
    @Transactional
    public void createFreeWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = freeRepository.findAll().size();

        // Create the Free with an existing ID
        free.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restFreeMockMvc.perform(post("/api/frees")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(free)))
            .andExpect(status().isBadRequest());

        // Validate the Free in the database
        List<Free> freeList = freeRepository.findAll();
        assertThat(freeList).hasSize(databaseSizeBeforeCreate);

        // Validate the Free in Elasticsearch
        verify(mockFreeSearchRepository, times(0)).save(free);
    }

    @Test
    @Transactional
    public void getAllFrees() throws Exception {
        // Initialize the database
        freeRepository.saveAndFlush(free);

        // Get all the freeList
        restFreeMockMvc.perform(get("/api/frees?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(free.getId().intValue())));
    }
    
    @SuppressWarnings({"unchecked"})
    public void getAllFreesWithEagerRelationshipsIsEnabled() throws Exception {
        FreeResource freeResource = new FreeResource(freeServiceMock);
        when(freeServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        MockMvc restFreeMockMvc = MockMvcBuilders.standaloneSetup(freeResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restFreeMockMvc.perform(get("/api/frees?eagerload=true"))
        .andExpect(status().isOk());

        verify(freeServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({"unchecked"})
    public void getAllFreesWithEagerRelationshipsIsNotEnabled() throws Exception {
        FreeResource freeResource = new FreeResource(freeServiceMock);
            when(freeServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));
            MockMvc restFreeMockMvc = MockMvcBuilders.standaloneSetup(freeResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restFreeMockMvc.perform(get("/api/frees?eagerload=true"))
        .andExpect(status().isOk());

            verify(freeServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    public void getFree() throws Exception {
        // Initialize the database
        freeRepository.saveAndFlush(free);

        // Get the free
        restFreeMockMvc.perform(get("/api/frees/{id}", free.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(free.getId().intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingFree() throws Exception {
        // Get the free
        restFreeMockMvc.perform(get("/api/frees/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateFree() throws Exception {
        // Initialize the database
        freeService.save(free);
        // As the test used the service layer, reset the Elasticsearch mock repository
        reset(mockFreeSearchRepository);

        int databaseSizeBeforeUpdate = freeRepository.findAll().size();

        // Update the free
        Free updatedFree = freeRepository.findById(free.getId()).get();
        // Disconnect from session so that the updates on updatedFree are not directly saved in db
        em.detach(updatedFree);

        restFreeMockMvc.perform(put("/api/frees")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedFree)))
            .andExpect(status().isOk());

        // Validate the Free in the database
        List<Free> freeList = freeRepository.findAll();
        assertThat(freeList).hasSize(databaseSizeBeforeUpdate);
        Free testFree = freeList.get(freeList.size() - 1);

        // Validate the Free in Elasticsearch
        verify(mockFreeSearchRepository, times(1)).save(testFree);
    }

    @Test
    @Transactional
    public void updateNonExistingFree() throws Exception {
        int databaseSizeBeforeUpdate = freeRepository.findAll().size();

        // Create the Free

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFreeMockMvc.perform(put("/api/frees")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(free)))
            .andExpect(status().isBadRequest());

        // Validate the Free in the database
        List<Free> freeList = freeRepository.findAll();
        assertThat(freeList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Free in Elasticsearch
        verify(mockFreeSearchRepository, times(0)).save(free);
    }

    @Test
    @Transactional
    public void deleteFree() throws Exception {
        // Initialize the database
        freeService.save(free);

        int databaseSizeBeforeDelete = freeRepository.findAll().size();

        // Delete the free
        restFreeMockMvc.perform(delete("/api/frees/{id}", free.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Free> freeList = freeRepository.findAll();
        assertThat(freeList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Free in Elasticsearch
        verify(mockFreeSearchRepository, times(1)).deleteById(free.getId());
    }

    @Test
    @Transactional
    public void searchFree() throws Exception {
        // Initialize the database
        freeService.save(free);
        when(mockFreeSearchRepository.search(queryStringQuery("id:" + free.getId())))
            .thenReturn(Collections.singletonList(free));
        // Search the free
        restFreeMockMvc.perform(get("/api/_search/frees?query=id:" + free.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(free.getId().intValue())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Free.class);
        Free free1 = new Free();
        free1.setId(1L);
        Free free2 = new Free();
        free2.setId(free1.getId());
        assertThat(free1).isEqualTo(free2);
        free2.setId(2L);
        assertThat(free1).isNotEqualTo(free2);
        free1.setId(null);
        assertThat(free1).isNotEqualTo(free2);
    }
}
