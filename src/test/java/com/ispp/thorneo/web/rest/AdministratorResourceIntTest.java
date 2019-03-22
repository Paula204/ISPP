package com.ispp.thorneo.web.rest;

import com.ispp.thorneo.ThorneoApp;

import com.ispp.thorneo.domain.Administrator;
import com.ispp.thorneo.repository.AdministratorRepository;
import com.ispp.thorneo.repository.search.AdministratorSearchRepository;
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
 * Test class for the AdministratorResource REST controller.
 *
 * @see AdministratorResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ThorneoApp.class)
public class AdministratorResourceIntTest {

    @Autowired
    private AdministratorRepository administratorRepository;

    /**
     * This repository is mocked in the com.ispp.thorneo.repository.search test package.
     *
     * @see com.ispp.thorneo.repository.search.AdministratorSearchRepositoryMockConfiguration
     */
    @Autowired
    private AdministratorSearchRepository mockAdministratorSearchRepository;

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

    private MockMvc restAdministratorMockMvc;

    private Administrator administrator;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final AdministratorResource administratorResource = new AdministratorResource(administratorRepository, mockAdministratorSearchRepository);
        this.restAdministratorMockMvc = MockMvcBuilders.standaloneSetup(administratorResource)
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
    public static Administrator createEntity(EntityManager em) {
        Administrator administrator = new Administrator();
        return administrator;
    }

    @Before
    public void initTest() {
        administrator = createEntity(em);
    }

    @Test
    @Transactional
    public void createAdministrator() throws Exception {
        int databaseSizeBeforeCreate = administratorRepository.findAll().size();

        // Create the Administrator
        restAdministratorMockMvc.perform(post("/api/administrators")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(administrator)))
            .andExpect(status().isCreated());

        // Validate the Administrator in the database
        List<Administrator> administratorList = administratorRepository.findAll();
        assertThat(administratorList).hasSize(databaseSizeBeforeCreate + 1);
        Administrator testAdministrator = administratorList.get(administratorList.size() - 1);

        // Validate the Administrator in Elasticsearch
        verify(mockAdministratorSearchRepository, times(1)).save(testAdministrator);
    }

    @Test
    @Transactional
    public void createAdministratorWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = administratorRepository.findAll().size();

        // Create the Administrator with an existing ID
        administrator.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restAdministratorMockMvc.perform(post("/api/administrators")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(administrator)))
            .andExpect(status().isBadRequest());

        // Validate the Administrator in the database
        List<Administrator> administratorList = administratorRepository.findAll();
        assertThat(administratorList).hasSize(databaseSizeBeforeCreate);

        // Validate the Administrator in Elasticsearch
        verify(mockAdministratorSearchRepository, times(0)).save(administrator);
    }

    @Test
    @Transactional
    public void getAllAdministrators() throws Exception {
        // Initialize the database
        administratorRepository.saveAndFlush(administrator);

        // Get all the administratorList
        restAdministratorMockMvc.perform(get("/api/administrators?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(administrator.getId().intValue())));
    }
    
    @Test
    @Transactional
    public void getAdministrator() throws Exception {
        // Initialize the database
        administratorRepository.saveAndFlush(administrator);

        // Get the administrator
        restAdministratorMockMvc.perform(get("/api/administrators/{id}", administrator.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(administrator.getId().intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingAdministrator() throws Exception {
        // Get the administrator
        restAdministratorMockMvc.perform(get("/api/administrators/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateAdministrator() throws Exception {
        // Initialize the database
        administratorRepository.saveAndFlush(administrator);

        int databaseSizeBeforeUpdate = administratorRepository.findAll().size();

        // Update the administrator
        Administrator updatedAdministrator = administratorRepository.findById(administrator.getId()).get();
        // Disconnect from session so that the updates on updatedAdministrator are not directly saved in db
        em.detach(updatedAdministrator);

        restAdministratorMockMvc.perform(put("/api/administrators")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedAdministrator)))
            .andExpect(status().isOk());

        // Validate the Administrator in the database
        List<Administrator> administratorList = administratorRepository.findAll();
        assertThat(administratorList).hasSize(databaseSizeBeforeUpdate);
        Administrator testAdministrator = administratorList.get(administratorList.size() - 1);

        // Validate the Administrator in Elasticsearch
        verify(mockAdministratorSearchRepository, times(1)).save(testAdministrator);
    }

    @Test
    @Transactional
    public void updateNonExistingAdministrator() throws Exception {
        int databaseSizeBeforeUpdate = administratorRepository.findAll().size();

        // Create the Administrator

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAdministratorMockMvc.perform(put("/api/administrators")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(administrator)))
            .andExpect(status().isBadRequest());

        // Validate the Administrator in the database
        List<Administrator> administratorList = administratorRepository.findAll();
        assertThat(administratorList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Administrator in Elasticsearch
        verify(mockAdministratorSearchRepository, times(0)).save(administrator);
    }

    @Test
    @Transactional
    public void deleteAdministrator() throws Exception {
        // Initialize the database
        administratorRepository.saveAndFlush(administrator);

        int databaseSizeBeforeDelete = administratorRepository.findAll().size();

        // Delete the administrator
        restAdministratorMockMvc.perform(delete("/api/administrators/{id}", administrator.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Administrator> administratorList = administratorRepository.findAll();
        assertThat(administratorList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Administrator in Elasticsearch
        verify(mockAdministratorSearchRepository, times(1)).deleteById(administrator.getId());
    }

    @Test
    @Transactional
    public void searchAdministrator() throws Exception {
        // Initialize the database
        administratorRepository.saveAndFlush(administrator);
        when(mockAdministratorSearchRepository.search(queryStringQuery("id:" + administrator.getId())))
            .thenReturn(Collections.singletonList(administrator));
        // Search the administrator
        restAdministratorMockMvc.perform(get("/api/_search/administrators?query=id:" + administrator.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(administrator.getId().intValue())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Administrator.class);
        Administrator administrator1 = new Administrator();
        administrator1.setId(1L);
        Administrator administrator2 = new Administrator();
        administrator2.setId(administrator1.getId());
        assertThat(administrator1).isEqualTo(administrator2);
        administrator2.setId(2L);
        assertThat(administrator1).isNotEqualTo(administrator2);
        administrator1.setId(null);
        assertThat(administrator1).isNotEqualTo(administrator2);
    }
}
