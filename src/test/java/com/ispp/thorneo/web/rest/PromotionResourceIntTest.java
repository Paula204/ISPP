package com.ispp.thorneo.web.rest;

import com.ispp.thorneo.ThorneoApp;

import com.ispp.thorneo.domain.Promotion;
import com.ispp.thorneo.domain.User;
import com.ispp.thorneo.repository.PromotionRepository;
import com.ispp.thorneo.repository.search.PromotionSearchRepository;
import com.ispp.thorneo.service.PromotionService;
import com.ispp.thorneo.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
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
 * Test class for the PromotionResource REST controller.
 *
 * @see PromotionResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ThorneoApp.class)
public class PromotionResourceIntTest {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_QR = "http://www.google.com";
    private static final String UPDATED_QR = "http://www.google.com";

    @Autowired
    private PromotionRepository promotionRepository;

    @Autowired
    private PromotionService promotionService;

    /**
     * This repository is mocked in the com.ispp.thorneo.repository.search test package.
     *
     * @see com.ispp.thorneo.repository.search.PromotionSearchRepositoryMockConfiguration
     */
    @Autowired
    private PromotionSearchRepository mockPromotionSearchRepository;

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

    private MockMvc restPromotionMockMvc;

    private Promotion promotion;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final PromotionResource promotionResource = new PromotionResource(promotionService);
        this.restPromotionMockMvc = MockMvcBuilders.standaloneSetup(promotionResource)
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
    public static Promotion createEntity(EntityManager em) {
        Promotion promotion = new Promotion()
            .title(DEFAULT_TITLE)
            .qr(DEFAULT_QR);
        // Add required entity
        User user = UserResourceIntTest.createEntity(em);
        em.persist(user);
        em.flush();
        promotion.setUser(user);
        return promotion;
    }

    @Before
    public void initTest() {
        promotion = createEntity(em);
    }

    @Test
    @Transactional
    public void createPromotion() throws Exception {
        int databaseSizeBeforeCreate = promotionRepository.findAll().size();

        // Create the Promotion
        restPromotionMockMvc.perform(post("/api/promotions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(promotion)))
            .andExpect(status().isCreated());

        // Validate the Promotion in the database
        List<Promotion> promotionList = promotionRepository.findAll();
        assertThat(promotionList).hasSize(databaseSizeBeforeCreate + 1);
        Promotion testPromotion = promotionList.get(promotionList.size() - 1);
        assertThat(testPromotion.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testPromotion.getQr()).isEqualTo(DEFAULT_QR);

        // Validate the Promotion in Elasticsearch
        verify(mockPromotionSearchRepository, times(1)).save(testPromotion);
    }

    @Test
    @Transactional
    public void createPromotionWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = promotionRepository.findAll().size();

        // Create the Promotion with an existing ID
        promotion.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPromotionMockMvc.perform(post("/api/promotions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(promotion)))
            .andExpect(status().isBadRequest());

        // Validate the Promotion in the database
        List<Promotion> promotionList = promotionRepository.findAll();
        assertThat(promotionList).hasSize(databaseSizeBeforeCreate);

        // Validate the Promotion in Elasticsearch
        verify(mockPromotionSearchRepository, times(0)).save(promotion);
    }

    @Test
    @Transactional
    public void checkTitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = promotionRepository.findAll().size();
        // set the field null
        promotion.setTitle(null);

        // Create the Promotion, which fails.

        restPromotionMockMvc.perform(post("/api/promotions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(promotion)))
            .andExpect(status().isBadRequest());

        List<Promotion> promotionList = promotionRepository.findAll();
        assertThat(promotionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkQrIsRequired() throws Exception {
        int databaseSizeBeforeTest = promotionRepository.findAll().size();
        // set the field null
        promotion.setQr(null);

        // Create the Promotion, which fails.

        restPromotionMockMvc.perform(post("/api/promotions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(promotion)))
            .andExpect(status().isBadRequest());

        List<Promotion> promotionList = promotionRepository.findAll();
        assertThat(promotionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllPromotions() throws Exception {
        // Initialize the database
        promotionRepository.saveAndFlush(promotion);

        // Get all the promotionList
        restPromotionMockMvc.perform(get("/api/promotions?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(promotion.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE.toString())))
            .andExpect(jsonPath("$.[*].qr").value(hasItem(DEFAULT_QR.toString())));
    }
    
    @Test
    @Transactional
    public void getPromotion() throws Exception {
        // Initialize the database
        promotionRepository.saveAndFlush(promotion);

        // Get the promotion
        restPromotionMockMvc.perform(get("/api/promotions/{id}", promotion.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(promotion.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE.toString()))
            .andExpect(jsonPath("$.qr").value(DEFAULT_QR.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingPromotion() throws Exception {
        // Get the promotion
        restPromotionMockMvc.perform(get("/api/promotions/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePromotion() throws Exception {
        // Initialize the database
        promotionService.save(promotion);
        // As the test used the service layer, reset the Elasticsearch mock repository
        reset(mockPromotionSearchRepository);

        int databaseSizeBeforeUpdate = promotionRepository.findAll().size();

        // Update the promotion
        Promotion updatedPromotion = promotionRepository.findById(promotion.getId()).get();
        // Disconnect from session so that the updates on updatedPromotion are not directly saved in db
        em.detach(updatedPromotion);
        updatedPromotion
            .title(UPDATED_TITLE)
            .qr(UPDATED_QR);

        restPromotionMockMvc.perform(put("/api/promotions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedPromotion)))
            .andExpect(status().isOk());

        // Validate the Promotion in the database
        List<Promotion> promotionList = promotionRepository.findAll();
        assertThat(promotionList).hasSize(databaseSizeBeforeUpdate);
        Promotion testPromotion = promotionList.get(promotionList.size() - 1);
        assertThat(testPromotion.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testPromotion.getQr()).isEqualTo(UPDATED_QR);

        // Validate the Promotion in Elasticsearch
        verify(mockPromotionSearchRepository, times(1)).save(testPromotion);
    }

    @Test
    @Transactional
    public void updateNonExistingPromotion() throws Exception {
        int databaseSizeBeforeUpdate = promotionRepository.findAll().size();

        // Create the Promotion

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPromotionMockMvc.perform(put("/api/promotions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(promotion)))
            .andExpect(status().isBadRequest());

        // Validate the Promotion in the database
        List<Promotion> promotionList = promotionRepository.findAll();
        assertThat(promotionList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Promotion in Elasticsearch
        verify(mockPromotionSearchRepository, times(0)).save(promotion);
    }

    @Test
    @Transactional
    public void deletePromotion() throws Exception {
        // Initialize the database
        promotionService.save(promotion);

        int databaseSizeBeforeDelete = promotionRepository.findAll().size();

        // Delete the promotion
        restPromotionMockMvc.perform(delete("/api/promotions/{id}", promotion.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Promotion> promotionList = promotionRepository.findAll();
        assertThat(promotionList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Promotion in Elasticsearch
        verify(mockPromotionSearchRepository, times(1)).deleteById(promotion.getId());
    }

    @Test
    @Transactional
    public void searchPromotion() throws Exception {
        // Initialize the database
        promotionService.save(promotion);
        when(mockPromotionSearchRepository.search(queryStringQuery("id:" + promotion.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(promotion), PageRequest.of(0, 1), 1));
        // Search the promotion
        restPromotionMockMvc.perform(get("/api/_search/promotions?query=id:" + promotion.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(promotion.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].qr").value(hasItem(DEFAULT_QR)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Promotion.class);
        Promotion promotion1 = new Promotion();
        promotion1.setId(1L);
        Promotion promotion2 = new Promotion();
        promotion2.setId(promotion1.getId());
        assertThat(promotion1).isEqualTo(promotion2);
        promotion2.setId(2L);
        assertThat(promotion1).isNotEqualTo(promotion2);
        promotion1.setId(null);
        assertThat(promotion1).isNotEqualTo(promotion2);
    }
}
