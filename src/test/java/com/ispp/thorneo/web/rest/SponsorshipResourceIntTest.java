package com.ispp.thorneo.web.rest;

import com.ispp.thorneo.ThorneoApp;

import com.ispp.thorneo.domain.Sponsorship;
import com.ispp.thorneo.domain.User;
import com.ispp.thorneo.repository.SponsorshipRepository;
import com.ispp.thorneo.repository.search.SponsorshipSearchRepository;
import com.ispp.thorneo.service.SponsorshipService;
import com.ispp.thorneo.service.UserService;
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
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.Collections;
import java.util.List;
import java.util.Optional;


import static com.ispp.thorneo.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the SponsorshipResource REST controller.
 *
 * @see SponsorshipResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ThorneoApp.class)
public class SponsorshipResourceIntTest {

    private static final String DEFAULT_BANNER = "http://AAAAAAAAAA";
    private static final String UPDATED_BANNER = "http://BBBBBBBBBB";

    private static final String DEFAULT_TARGET_URL = "http://AAAAAAAAAA";
    private static final String UPDATED_TARGET_URL = "http://BBBBBBBBBB";

    @Autowired
    private SponsorshipRepository sponsorshipRepository;

    @Autowired
    private SponsorshipService sponsorshipService;

    @Mock
    private UserService userService;

    /**
     * This repository is mocked in the com.ispp.thorneo.repository.search test package.
     *
     * @see com.ispp.thorneo.repository.search.SponsorshipSearchRepositoryMockConfiguration
     */
    @Autowired
    private SponsorshipSearchRepository mockSponsorshipSearchRepository;

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

    @Autowired
    private SponsorshipResource sponsorshipResource;

    private MockMvc restSponsorshipMockMvc;

    private Sponsorship sponsorship;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final SponsorshipResource sponsorshipResource = new SponsorshipResource(sponsorshipService, userService);
        this.restSponsorshipMockMvc = MockMvcBuilders.standaloneSetup(sponsorshipResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();

        when(userService.getUserWithAuthorities()).thenReturn(Optional.of(sponsorship.getUser()));

    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Sponsorship createEntity(EntityManager em) {
        Sponsorship sponsorship = new Sponsorship()
            .banner(DEFAULT_BANNER)
            .targetUrl(DEFAULT_TARGET_URL);
        User user = UserResourceIntTest.createEntity(em);
        em.persist(user);
        sponsorship.setUser(user);

        return sponsorship;
    }

    @Before
    public void initTest() {
        sponsorship = createEntity(em);
    }

    @Test
    @Transactional
    public void createSponsorship() throws Exception {
        int databaseSizeBeforeCreate = sponsorshipRepository.findAll().size();

        // Create the Sponsorship
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(new UsernamePasswordAuthenticationToken(sponsorship.getUser().getLogin(),
            sponsorship.getUser().getPassword()));
        SecurityContextHolder.setContext(securityContext);
        this.sponsorshipResource.createSponsorship(sponsorship);

        // Validate the Sponsorship in the database
        List<Sponsorship> sponsorshipList = sponsorshipRepository.findAll();
        assertThat(sponsorshipList).hasSize(databaseSizeBeforeCreate + 1);
        Sponsorship testSponsorship = sponsorshipList.get(sponsorshipList.size() - 1);
        assertThat(testSponsorship.getBanner()).isEqualTo(DEFAULT_BANNER);
        assertThat(testSponsorship.getTargetUrl()).isEqualTo(DEFAULT_TARGET_URL);

        // Validate the Sponsorship in Elasticsearch
        verify(mockSponsorshipSearchRepository, times(1)).save(testSponsorship);
    }

    @Test
    @Transactional
    public void createSponsorshipWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = sponsorshipRepository.findAll().size();

        // Create the Sponsorship with an existing ID
        sponsorship.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restSponsorshipMockMvc.perform(post("/api/sponsorships")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(sponsorship)))
            .andExpect(status().isBadRequest());

        // Validate the Sponsorship in the database
        List<Sponsorship> sponsorshipList = sponsorshipRepository.findAll();
        assertThat(sponsorshipList).hasSize(databaseSizeBeforeCreate);

        // Validate the Sponsorship in Elasticsearch
        verify(mockSponsorshipSearchRepository, times(0)).save(sponsorship);
    }

    @Test
    @Transactional
    public void checkBannerIsRequired() throws Exception {
        int databaseSizeBeforeTest = sponsorshipRepository.findAll().size();
        // set the field null
        sponsorship.setBanner(null);

        // Create the Sponsorship, which fails.

        restSponsorshipMockMvc.perform(post("/api/sponsorships")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(sponsorship)))
            .andExpect(status().isBadRequest());

        List<Sponsorship> sponsorshipList = sponsorshipRepository.findAll();
        assertThat(sponsorshipList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkTargetUrlIsRequired() throws Exception {
        int databaseSizeBeforeTest = sponsorshipRepository.findAll().size();
        // set the field null
        sponsorship.setTargetUrl(null);

        // Create the Sponsorship, which fails.

        restSponsorshipMockMvc.perform(post("/api/sponsorships")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(sponsorship)))
            .andExpect(status().isBadRequest());

        List<Sponsorship> sponsorshipList = sponsorshipRepository.findAll();
        assertThat(sponsorshipList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllSponsorships() throws Exception {
        // Initialize the database
        sponsorshipRepository.saveAndFlush(sponsorship);

        // Get all the sponsorshipList
        restSponsorshipMockMvc.perform(get("/api/sponsorships?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sponsorship.getId().intValue())))
            .andExpect(jsonPath("$.[*].banner").value(hasItem(DEFAULT_BANNER.toString())))
            .andExpect(jsonPath("$.[*].targetUrl").value(hasItem(DEFAULT_TARGET_URL.toString())));
    }
    
    @Test
    @Transactional
    public void getSponsorship() throws Exception {
        // Initialize the database
        sponsorshipRepository.saveAndFlush(sponsorship);

        // Get the sponsorship
        restSponsorshipMockMvc.perform(get("/api/sponsorships/{id}", sponsorship.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(sponsorship.getId().intValue()))
            .andExpect(jsonPath("$.banner").value(DEFAULT_BANNER.toString()))
            .andExpect(jsonPath("$.targetUrl").value(DEFAULT_TARGET_URL.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingSponsorship() throws Exception {
        // Get the sponsorship
        restSponsorshipMockMvc.perform(get("/api/sponsorships/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateNonExistingSponsorship() throws Exception {
        int databaseSizeBeforeUpdate = sponsorshipRepository.findAll().size();

        // Create the Sponsorship

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSponsorshipMockMvc.perform(put("/api/sponsorships")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(sponsorship)))
            .andExpect(status().isBadRequest());

        // Validate the Sponsorship in the database
        List<Sponsorship> sponsorshipList = sponsorshipRepository.findAll();
        assertThat(sponsorshipList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Sponsorship in Elasticsearch
        verify(mockSponsorshipSearchRepository, times(0)).save(sponsorship);
    }

    @Test
    @Transactional
    public void deleteSponsorship() throws Exception {
        // Initialize the database
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(new UsernamePasswordAuthenticationToken(sponsorship.getUser().getLogin(),
            sponsorship.getUser().getPassword()));
        SecurityContextHolder.setContext(securityContext);
        sponsorshipService.save(sponsorship);

        int databaseSizeBeforeDelete = sponsorshipRepository.findAll().size();

        when(userService.getUserWithAuthorities()).thenReturn(Optional.of(sponsorship.getUser()));

        // Delete the sponsorship
        restSponsorshipMockMvc.perform(delete("/api/sponsorships/{id}", sponsorship.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Sponsorship> sponsorshipList = sponsorshipRepository.findAll();
        assertThat(sponsorshipList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Sponsorship in Elasticsearch
        verify(mockSponsorshipSearchRepository, times(1)).deleteById(sponsorship.getId());
    }

    @Test
    @Transactional
    public void searchSponsorship() throws Exception {
        // Initialize the database
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(new UsernamePasswordAuthenticationToken(sponsorship.getUser().getLogin(),
            sponsorship.getUser().getPassword()));
        SecurityContextHolder.setContext(securityContext);
        sponsorshipService.save(sponsorship);
        when(mockSponsorshipSearchRepository.search(queryStringQuery("id:" + sponsorship.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(sponsorship), PageRequest.of(0, 1), 1));
        // Search the sponsorship
        restSponsorshipMockMvc.perform(get("/api/_search/sponsorships?query=id:" + sponsorship.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sponsorship.getId().intValue())))
            .andExpect(jsonPath("$.[*].banner").value(hasItem(DEFAULT_BANNER)))
            .andExpect(jsonPath("$.[*].targetUrl").value(hasItem(DEFAULT_TARGET_URL)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Sponsorship.class);
        Sponsorship sponsorship1 = new Sponsorship();
        sponsorship1.setId(1L);
        Sponsorship sponsorship2 = new Sponsorship();
        sponsorship2.setId(sponsorship1.getId());
        assertThat(sponsorship1).isEqualTo(sponsorship2);
        sponsorship2.setId(2L);
        assertThat(sponsorship1).isNotEqualTo(sponsorship2);
        sponsorship1.setId(null);
        assertThat(sponsorship1).isNotEqualTo(sponsorship2);
    }
}
