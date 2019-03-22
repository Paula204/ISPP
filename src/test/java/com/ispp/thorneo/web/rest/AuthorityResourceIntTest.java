package com.ispp.thorneo.web.rest;

import com.ispp.thorneo.ThorneoApp;

import com.ispp.thorneo.domain.Authority;
import com.ispp.thorneo.repository.AuthorityRepository;
import com.ispp.thorneo.repository.search.AuthoritySearchRepository;
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
 * Test class for the AuthorityResource REST controller.
 *
 * @see AuthorityResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ThorneoApp.class)
public class AuthorityResourceIntTest {

    private static final String DEFAULT_FREE = "AAAAAAAAAA";
    private static final String UPDATED_FREE = "BBBBBBBBBB";

    private static final String DEFAULT_PREMIUM = "AAAAAAAAAA";
    private static final String UPDATED_PREMIUM = "BBBBBBBBBB";

    private static final String DEFAULT_SPONSOR = "AAAAAAAAAA";
    private static final String UPDATED_SPONSOR = "BBBBBBBBBB";

    @Autowired
    private AuthorityRepository authorityRepository;

    /**
     * This repository is mocked in the com.ispp.thorneo.repository.search test package.
     *
     * @see com.ispp.thorneo.repository.search.AuthoritySearchRepositoryMockConfiguration
     */
    @Autowired
    private AuthoritySearchRepository mockAuthoritySearchRepository;

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

    private MockMvc restAuthorityMockMvc;

    private Authority authority;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final AuthorityResource authorityResource = new AuthorityResource(authorityRepository, mockAuthoritySearchRepository);
        this.restAuthorityMockMvc = MockMvcBuilders.standaloneSetup(authorityResource)
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
    public static Authority createEntity(EntityManager em) {
        Authority authority = new Authority()
            .free(DEFAULT_FREE)
            .premium(DEFAULT_PREMIUM)
            .sponsor(DEFAULT_SPONSOR);
        return authority;
    }

    @Before
    public void initTest() {
        authority = createEntity(em);
    }

    @Test
    @Transactional
    public void createAuthority() throws Exception {
        int databaseSizeBeforeCreate = authorityRepository.findAll().size();

        // Create the Authority
        restAuthorityMockMvc.perform(post("/api/authorities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(authority)))
            .andExpect(status().isCreated());

        // Validate the Authority in the database
        List<Authority> authorityList = authorityRepository.findAll();
        assertThat(authorityList).hasSize(databaseSizeBeforeCreate + 1);
        Authority testAuthority = authorityList.get(authorityList.size() - 1);
        assertThat(testAuthority.getFree()).isEqualTo(DEFAULT_FREE);
        assertThat(testAuthority.getPremium()).isEqualTo(DEFAULT_PREMIUM);
        assertThat(testAuthority.getSponsor()).isEqualTo(DEFAULT_SPONSOR);

        // Validate the Authority in Elasticsearch
        verify(mockAuthoritySearchRepository, times(1)).save(testAuthority);
    }

    @Test
    @Transactional
    public void createAuthorityWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = authorityRepository.findAll().size();

        // Create the Authority with an existing ID
        authority.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restAuthorityMockMvc.perform(post("/api/authorities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(authority)))
            .andExpect(status().isBadRequest());

        // Validate the Authority in the database
        List<Authority> authorityList = authorityRepository.findAll();
        assertThat(authorityList).hasSize(databaseSizeBeforeCreate);

        // Validate the Authority in Elasticsearch
        verify(mockAuthoritySearchRepository, times(0)).save(authority);
    }

    @Test
    @Transactional
    public void getAllAuthorities() throws Exception {
        // Initialize the database
        authorityRepository.saveAndFlush(authority);

        // Get all the authorityList
        restAuthorityMockMvc.perform(get("/api/authorities?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(authority.getId().intValue())))
            .andExpect(jsonPath("$.[*].free").value(hasItem(DEFAULT_FREE.toString())))
            .andExpect(jsonPath("$.[*].premium").value(hasItem(DEFAULT_PREMIUM.toString())))
            .andExpect(jsonPath("$.[*].sponsor").value(hasItem(DEFAULT_SPONSOR.toString())));
    }
    
    @Test
    @Transactional
    public void getAuthority() throws Exception {
        // Initialize the database
        authorityRepository.saveAndFlush(authority);

        // Get the authority
        restAuthorityMockMvc.perform(get("/api/authorities/{id}", authority.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(authority.getId().intValue()))
            .andExpect(jsonPath("$.free").value(DEFAULT_FREE.toString()))
            .andExpect(jsonPath("$.premium").value(DEFAULT_PREMIUM.toString()))
            .andExpect(jsonPath("$.sponsor").value(DEFAULT_SPONSOR.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingAuthority() throws Exception {
        // Get the authority
        restAuthorityMockMvc.perform(get("/api/authorities/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateAuthority() throws Exception {
        // Initialize the database
        authorityRepository.saveAndFlush(authority);

        int databaseSizeBeforeUpdate = authorityRepository.findAll().size();

        // Update the authority
        Authority updatedAuthority = authorityRepository.findById(authority.getId()).get();
        // Disconnect from session so that the updates on updatedAuthority are not directly saved in db
        em.detach(updatedAuthority);
        updatedAuthority
            .free(UPDATED_FREE)
            .premium(UPDATED_PREMIUM)
            .sponsor(UPDATED_SPONSOR);

        restAuthorityMockMvc.perform(put("/api/authorities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedAuthority)))
            .andExpect(status().isOk());

        // Validate the Authority in the database
        List<Authority> authorityList = authorityRepository.findAll();
        assertThat(authorityList).hasSize(databaseSizeBeforeUpdate);
        Authority testAuthority = authorityList.get(authorityList.size() - 1);
        assertThat(testAuthority.getFree()).isEqualTo(UPDATED_FREE);
        assertThat(testAuthority.getPremium()).isEqualTo(UPDATED_PREMIUM);
        assertThat(testAuthority.getSponsor()).isEqualTo(UPDATED_SPONSOR);

        // Validate the Authority in Elasticsearch
        verify(mockAuthoritySearchRepository, times(1)).save(testAuthority);
    }

    @Test
    @Transactional
    public void updateNonExistingAuthority() throws Exception {
        int databaseSizeBeforeUpdate = authorityRepository.findAll().size();

        // Create the Authority

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAuthorityMockMvc.perform(put("/api/authorities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(authority)))
            .andExpect(status().isBadRequest());

        // Validate the Authority in the database
        List<Authority> authorityList = authorityRepository.findAll();
        assertThat(authorityList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Authority in Elasticsearch
        verify(mockAuthoritySearchRepository, times(0)).save(authority);
    }

    @Test
    @Transactional
    public void deleteAuthority() throws Exception {
        // Initialize the database
        authorityRepository.saveAndFlush(authority);

        int databaseSizeBeforeDelete = authorityRepository.findAll().size();

        // Delete the authority
        restAuthorityMockMvc.perform(delete("/api/authorities/{id}", authority.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Authority> authorityList = authorityRepository.findAll();
        assertThat(authorityList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Authority in Elasticsearch
        verify(mockAuthoritySearchRepository, times(1)).deleteById(authority.getId());
    }

    @Test
    @Transactional
    public void searchAuthority() throws Exception {
        // Initialize the database
        authorityRepository.saveAndFlush(authority);
        when(mockAuthoritySearchRepository.search(queryStringQuery("id:" + authority.getId())))
            .thenReturn(Collections.singletonList(authority));
        // Search the authority
        restAuthorityMockMvc.perform(get("/api/_search/authorities?query=id:" + authority.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(authority.getId().intValue())))
            .andExpect(jsonPath("$.[*].free").value(hasItem(DEFAULT_FREE)))
            .andExpect(jsonPath("$.[*].premium").value(hasItem(DEFAULT_PREMIUM)))
            .andExpect(jsonPath("$.[*].sponsor").value(hasItem(DEFAULT_SPONSOR)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Authority.class);
        Authority authority1 = new Authority();
        authority1.setId(1L);
        Authority authority2 = new Authority();
        authority2.setId(authority1.getId());
        assertThat(authority1).isEqualTo(authority2);
        authority2.setId(2L);
        assertThat(authority1).isNotEqualTo(authority2);
        authority1.setId(null);
        assertThat(authority1).isNotEqualTo(authority2);
    }
}
