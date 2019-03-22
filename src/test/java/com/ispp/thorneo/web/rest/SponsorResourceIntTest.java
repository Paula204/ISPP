package com.ispp.thorneo.web.rest;

import com.ispp.thorneo.ThorneoApp;

import com.ispp.thorneo.domain.Sponsor;
import com.ispp.thorneo.repository.SponsorRepository;
import com.ispp.thorneo.repository.search.SponsorSearchRepository;
import com.ispp.thorneo.service.SponsorService;
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
 * Test class for the SponsorResource REST controller.
 *
 * @see SponsorResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ThorneoApp.class)
public class SponsorResourceIntTest {

    @Autowired
    private SponsorRepository sponsorRepository;

    @Mock
    private SponsorRepository sponsorRepositoryMock;

    @Mock
    private SponsorService sponsorServiceMock;

    @Autowired
    private SponsorService sponsorService;

    /**
     * This repository is mocked in the com.ispp.thorneo.repository.search test package.
     *
     * @see com.ispp.thorneo.repository.search.SponsorSearchRepositoryMockConfiguration
     */
    @Autowired
    private SponsorSearchRepository mockSponsorSearchRepository;

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

    private MockMvc restSponsorMockMvc;

    private Sponsor sponsor;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final SponsorResource sponsorResource = new SponsorResource(sponsorService);
        this.restSponsorMockMvc = MockMvcBuilders.standaloneSetup(sponsorResource)
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
    public static Sponsor createEntity(EntityManager em) {
        Sponsor sponsor = new Sponsor();
        return sponsor;
    }

    @Before
    public void initTest() {
        sponsor = createEntity(em);
    }

    @Test
    @Transactional
    public void createSponsor() throws Exception {
        int databaseSizeBeforeCreate = sponsorRepository.findAll().size();

        // Create the Sponsor
        restSponsorMockMvc.perform(post("/api/sponsors")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(sponsor)))
            .andExpect(status().isCreated());

        // Validate the Sponsor in the database
        List<Sponsor> sponsorList = sponsorRepository.findAll();
        assertThat(sponsorList).hasSize(databaseSizeBeforeCreate + 1);
        Sponsor testSponsor = sponsorList.get(sponsorList.size() - 1);

        // Validate the Sponsor in Elasticsearch
        verify(mockSponsorSearchRepository, times(1)).save(testSponsor);
    }

    @Test
    @Transactional
    public void createSponsorWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = sponsorRepository.findAll().size();

        // Create the Sponsor with an existing ID
        sponsor.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restSponsorMockMvc.perform(post("/api/sponsors")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(sponsor)))
            .andExpect(status().isBadRequest());

        // Validate the Sponsor in the database
        List<Sponsor> sponsorList = sponsorRepository.findAll();
        assertThat(sponsorList).hasSize(databaseSizeBeforeCreate);

        // Validate the Sponsor in Elasticsearch
        verify(mockSponsorSearchRepository, times(0)).save(sponsor);
    }

    @Test
    @Transactional
    public void getAllSponsors() throws Exception {
        // Initialize the database
        sponsorRepository.saveAndFlush(sponsor);

        // Get all the sponsorList
        restSponsorMockMvc.perform(get("/api/sponsors?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sponsor.getId().intValue())));
    }
    
    @SuppressWarnings({"unchecked"})
    public void getAllSponsorsWithEagerRelationshipsIsEnabled() throws Exception {
        SponsorResource sponsorResource = new SponsorResource(sponsorServiceMock);
        when(sponsorServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        MockMvc restSponsorMockMvc = MockMvcBuilders.standaloneSetup(sponsorResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restSponsorMockMvc.perform(get("/api/sponsors?eagerload=true"))
        .andExpect(status().isOk());

        verify(sponsorServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({"unchecked"})
    public void getAllSponsorsWithEagerRelationshipsIsNotEnabled() throws Exception {
        SponsorResource sponsorResource = new SponsorResource(sponsorServiceMock);
            when(sponsorServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));
            MockMvc restSponsorMockMvc = MockMvcBuilders.standaloneSetup(sponsorResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restSponsorMockMvc.perform(get("/api/sponsors?eagerload=true"))
        .andExpect(status().isOk());

            verify(sponsorServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    public void getSponsor() throws Exception {
        // Initialize the database
        sponsorRepository.saveAndFlush(sponsor);

        // Get the sponsor
        restSponsorMockMvc.perform(get("/api/sponsors/{id}", sponsor.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(sponsor.getId().intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingSponsor() throws Exception {
        // Get the sponsor
        restSponsorMockMvc.perform(get("/api/sponsors/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateSponsor() throws Exception {
        // Initialize the database
        sponsorService.save(sponsor);
        // As the test used the service layer, reset the Elasticsearch mock repository
        reset(mockSponsorSearchRepository);

        int databaseSizeBeforeUpdate = sponsorRepository.findAll().size();

        // Update the sponsor
        Sponsor updatedSponsor = sponsorRepository.findById(sponsor.getId()).get();
        // Disconnect from session so that the updates on updatedSponsor are not directly saved in db
        em.detach(updatedSponsor);

        restSponsorMockMvc.perform(put("/api/sponsors")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedSponsor)))
            .andExpect(status().isOk());

        // Validate the Sponsor in the database
        List<Sponsor> sponsorList = sponsorRepository.findAll();
        assertThat(sponsorList).hasSize(databaseSizeBeforeUpdate);
        Sponsor testSponsor = sponsorList.get(sponsorList.size() - 1);

        // Validate the Sponsor in Elasticsearch
        verify(mockSponsorSearchRepository, times(1)).save(testSponsor);
    }

    @Test
    @Transactional
    public void updateNonExistingSponsor() throws Exception {
        int databaseSizeBeforeUpdate = sponsorRepository.findAll().size();

        // Create the Sponsor

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSponsorMockMvc.perform(put("/api/sponsors")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(sponsor)))
            .andExpect(status().isBadRequest());

        // Validate the Sponsor in the database
        List<Sponsor> sponsorList = sponsorRepository.findAll();
        assertThat(sponsorList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Sponsor in Elasticsearch
        verify(mockSponsorSearchRepository, times(0)).save(sponsor);
    }

    @Test
    @Transactional
    public void deleteSponsor() throws Exception {
        // Initialize the database
        sponsorService.save(sponsor);

        int databaseSizeBeforeDelete = sponsorRepository.findAll().size();

        // Delete the sponsor
        restSponsorMockMvc.perform(delete("/api/sponsors/{id}", sponsor.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Sponsor> sponsorList = sponsorRepository.findAll();
        assertThat(sponsorList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Sponsor in Elasticsearch
        verify(mockSponsorSearchRepository, times(1)).deleteById(sponsor.getId());
    }

    @Test
    @Transactional
    public void searchSponsor() throws Exception {
        // Initialize the database
        sponsorService.save(sponsor);
        when(mockSponsorSearchRepository.search(queryStringQuery("id:" + sponsor.getId())))
            .thenReturn(Collections.singletonList(sponsor));
        // Search the sponsor
        restSponsorMockMvc.perform(get("/api/_search/sponsors?query=id:" + sponsor.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sponsor.getId().intValue())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Sponsor.class);
        Sponsor sponsor1 = new Sponsor();
        sponsor1.setId(1L);
        Sponsor sponsor2 = new Sponsor();
        sponsor2.setId(sponsor1.getId());
        assertThat(sponsor1).isEqualTo(sponsor2);
        sponsor2.setId(2L);
        assertThat(sponsor1).isNotEqualTo(sponsor2);
        sponsor1.setId(null);
        assertThat(sponsor1).isNotEqualTo(sponsor2);
    }
}
