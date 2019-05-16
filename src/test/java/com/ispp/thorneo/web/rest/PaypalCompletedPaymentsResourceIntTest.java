package com.ispp.thorneo.web.rest;

import com.ispp.thorneo.ThorneoApp;

import com.ispp.thorneo.domain.PaypalCompletedPayments;
import com.ispp.thorneo.repository.PaypalCompletedPaymentsRepository;
import com.ispp.thorneo.repository.search.PaypalCompletedPaymentsSearchRepository;
import com.ispp.thorneo.service.UserService;
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

import io.jsonwebtoken.lang.Assert;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static com.ispp.thorneo.web.rest.TestUtil.sameInstant;
import static com.ispp.thorneo.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the PaypalCompletedPaymentsResource REST controller.
 *
 * @see PaypalCompletedPaymentsResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ThorneoApp.class)
public class PaypalCompletedPaymentsResourceIntTest {

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_ID_PAYMENT = "AAAAAAAAAA";
    private static final String UPDATED_ID_PAYMENT = "BBBBBBBBBB";

    private static final String DEFAULT_CURRENCY = "AAAAAAAAAA";
    private static final String UPDATED_CURRENCY = "BBBBBBBBBB";

    private static final Float DEFAULT_AMOUNT = 0F;
    private static final Float UPDATED_AMOUNT = 1F;

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    @Autowired
    private PaypalCompletedPaymentsRepository paypalCompletedPaymentsRepository;

    /**
     * This repository is mocked in the com.ispp.thorneo.repository.search test package.
     *
     * @see com.ispp.thorneo.repository.search.PaypalCompletedPaymentsSearchRepositoryMockConfiguration
     */
    @Autowired
    private PaypalCompletedPaymentsSearchRepository mockPaypalCompletedPaymentsSearchRepository;

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

    private MockMvc restPaypalCompletedPaymentsMockMvc;

    private PaypalCompletedPayments paypalCompletedPayments;

    @Autowired
    private UserService userService;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final PaypalCompletedPaymentsResource paypalCompletedPaymentsResource = new PaypalCompletedPaymentsResource(paypalCompletedPaymentsRepository, 
            mockPaypalCompletedPaymentsSearchRepository, userService);
        this.restPaypalCompletedPaymentsMockMvc = MockMvcBuilders.standaloneSetup(paypalCompletedPaymentsResource)
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
    public static PaypalCompletedPayments createEntity(EntityManager em) {
        PaypalCompletedPayments paypalCompletedPayments = new PaypalCompletedPayments()
            .date(DEFAULT_DATE)
            .idPayment(DEFAULT_ID_PAYMENT)
            .currency(DEFAULT_CURRENCY)
            .amount(DEFAULT_AMOUNT)
            .email(DEFAULT_EMAIL)
            .name(DEFAULT_NAME)
            .status(DEFAULT_STATUS);
        return paypalCompletedPayments;
    }

    @Before
    public void initTest() {
        paypalCompletedPayments = createEntity(em);
    }

    @Test
    @Transactional
    public void createPaypalCompletedPayments() throws Exception {
        int databaseSizeBeforeCreate = paypalCompletedPaymentsRepository.findAll().size();

        // Create the PaypalCompletedPayments
        restPaypalCompletedPaymentsMockMvc.perform(post("/api/paypal-completed-payments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(paypalCompletedPayments)))
            .andExpect(status().isCreated());

        // Validate the PaypalCompletedPayments in the database
        List<PaypalCompletedPayments> paypalCompletedPaymentsList = paypalCompletedPaymentsRepository.findAll();
        assertThat(paypalCompletedPaymentsList).hasSize(databaseSizeBeforeCreate + 1);
        PaypalCompletedPayments testPaypalCompletedPayments = paypalCompletedPaymentsList.get(paypalCompletedPaymentsList.size() - 1);
        assertThat(testPaypalCompletedPayments.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testPaypalCompletedPayments.getIdPayment()).isEqualTo(DEFAULT_ID_PAYMENT);
        assertThat(testPaypalCompletedPayments.getCurrency()).isEqualTo(DEFAULT_CURRENCY);
        assertThat(testPaypalCompletedPayments.getAmount()).isEqualTo(DEFAULT_AMOUNT);
        assertThat(testPaypalCompletedPayments.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testPaypalCompletedPayments.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testPaypalCompletedPayments.getStatus()).isEqualTo(DEFAULT_STATUS);

        // Validate the PaypalCompletedPayments in Elasticsearch
        verify(mockPaypalCompletedPaymentsSearchRepository, times(1)).save(testPaypalCompletedPayments);
    }

    @Test
    @Transactional
    public void createPaypalCompletedPaymentsWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = paypalCompletedPaymentsRepository.findAll().size();

        // Create the PaypalCompletedPayments with an existing ID
        paypalCompletedPayments.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPaypalCompletedPaymentsMockMvc.perform(post("/api/paypal-completed-payments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(paypalCompletedPayments)))
            .andExpect(status().isBadRequest());

        // Validate the PaypalCompletedPayments in the database
        List<PaypalCompletedPayments> paypalCompletedPaymentsList = paypalCompletedPaymentsRepository.findAll();
        assertThat(paypalCompletedPaymentsList).hasSize(databaseSizeBeforeCreate);

        // Validate the PaypalCompletedPayments in Elasticsearch
        verify(mockPaypalCompletedPaymentsSearchRepository, times(0)).save(paypalCompletedPayments);
    }

    @Test
    @Transactional
    public void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = paypalCompletedPaymentsRepository.findAll().size();
        // set the field null
        paypalCompletedPayments.setDate(null);

        // Create the PaypalCompletedPayments, which fails.

        restPaypalCompletedPaymentsMockMvc.perform(post("/api/paypal-completed-payments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(paypalCompletedPayments)))
            .andExpect(status().isBadRequest());

        List<PaypalCompletedPayments> paypalCompletedPaymentsList = paypalCompletedPaymentsRepository.findAll();
        assertThat(paypalCompletedPaymentsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkIdPaymentIsRequired() throws Exception {
        int databaseSizeBeforeTest = paypalCompletedPaymentsRepository.findAll().size();
        // set the field null
        paypalCompletedPayments.setIdPayment(null);

        // Create the PaypalCompletedPayments, which fails.

        restPaypalCompletedPaymentsMockMvc.perform(post("/api/paypal-completed-payments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(paypalCompletedPayments)))
            .andExpect(status().isBadRequest());

        List<PaypalCompletedPayments> paypalCompletedPaymentsList = paypalCompletedPaymentsRepository.findAll();
        assertThat(paypalCompletedPaymentsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkCurrencyIsRequired() throws Exception {
        int databaseSizeBeforeTest = paypalCompletedPaymentsRepository.findAll().size();
        // set the field null
        paypalCompletedPayments.setCurrency(null);

        // Create the PaypalCompletedPayments, which fails.

        restPaypalCompletedPaymentsMockMvc.perform(post("/api/paypal-completed-payments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(paypalCompletedPayments)))
            .andExpect(status().isBadRequest());

        List<PaypalCompletedPayments> paypalCompletedPaymentsList = paypalCompletedPaymentsRepository.findAll();
        assertThat(paypalCompletedPaymentsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkAmountIsRequired() throws Exception {
        int databaseSizeBeforeTest = paypalCompletedPaymentsRepository.findAll().size();
        // set the field null
        paypalCompletedPayments.setAmount(null);

        // Create the PaypalCompletedPayments, which fails.

        restPaypalCompletedPaymentsMockMvc.perform(post("/api/paypal-completed-payments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(paypalCompletedPayments)))
            .andExpect(status().isBadRequest());

        List<PaypalCompletedPayments> paypalCompletedPaymentsList = paypalCompletedPaymentsRepository.findAll();
        assertThat(paypalCompletedPaymentsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkEmailIsRequired() throws Exception {
        int databaseSizeBeforeTest = paypalCompletedPaymentsRepository.findAll().size();
        // set the field null
        paypalCompletedPayments.setEmail(null);

        // Create the PaypalCompletedPayments, which fails.

        restPaypalCompletedPaymentsMockMvc.perform(post("/api/paypal-completed-payments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(paypalCompletedPayments)))
            .andExpect(status().isBadRequest());

        List<PaypalCompletedPayments> paypalCompletedPaymentsList = paypalCompletedPaymentsRepository.findAll();
        assertThat(paypalCompletedPaymentsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = paypalCompletedPaymentsRepository.findAll().size();
        // set the field null
        paypalCompletedPayments.setName(null);

        // Create the PaypalCompletedPayments, which fails.

        restPaypalCompletedPaymentsMockMvc.perform(post("/api/paypal-completed-payments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(paypalCompletedPayments)))
            .andExpect(status().isBadRequest());

        List<PaypalCompletedPayments> paypalCompletedPaymentsList = paypalCompletedPaymentsRepository.findAll();
        assertThat(paypalCompletedPaymentsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkStatusIsRequired() throws Exception {
        int databaseSizeBeforeTest = paypalCompletedPaymentsRepository.findAll().size();
        // set the field null
        paypalCompletedPayments.setStatus(null);

        // Create the PaypalCompletedPayments, which fails.

        restPaypalCompletedPaymentsMockMvc.perform(post("/api/paypal-completed-payments")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(paypalCompletedPayments)))
            .andExpect(status().isBadRequest());

        List<PaypalCompletedPayments> paypalCompletedPaymentsList = paypalCompletedPaymentsRepository.findAll();
        assertThat(paypalCompletedPaymentsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllPaypalCompletedPayments() throws Exception {
        // Initialize the database
        paypalCompletedPaymentsRepository.saveAndFlush(paypalCompletedPayments);

        // Get all the paypalCompletedPaymentsList
        List<PaypalCompletedPayments> all = this.paypalCompletedPaymentsRepository.findAll();
        Assert.notNull(all);
    }
    
    @Test
    @Transactional
    public void getPaypalCompletedPayments() throws Exception {
        // Initialize the database
        paypalCompletedPaymentsRepository.saveAndFlush(paypalCompletedPayments);

        // Get the paypalCompletedPayments
        List<PaypalCompletedPayments> all = this.paypalCompletedPaymentsRepository.findAll();
        Assert.notNull(all);
    }

    @Test
    @Transactional
    public void getNonExistingPaypalCompletedPayments() throws Exception {
        // Get the paypalCompletedPayments
        restPaypalCompletedPaymentsMockMvc.perform(get("/api/paypal-completed-payments/{id}", 15000000L))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void searchPaypalCompletedPayments() throws Exception {
        // Initialize the database
        paypalCompletedPaymentsRepository.saveAndFlush(paypalCompletedPayments);
        when(mockPaypalCompletedPaymentsSearchRepository.search(queryStringQuery("id:" + paypalCompletedPayments.getId())))
            .thenReturn(Collections.singletonList(paypalCompletedPayments));
        // Search the paypalCompletedPayments
        restPaypalCompletedPaymentsMockMvc.perform(get("/api/_search/paypal-completed-payments?query=id:" + paypalCompletedPayments.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(paypalCompletedPayments.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))))
            .andExpect(jsonPath("$.[*].idPayment").value(hasItem(DEFAULT_ID_PAYMENT)))
            .andExpect(jsonPath("$.[*].currency").value(hasItem(DEFAULT_CURRENCY)))
            .andExpect(jsonPath("$.[*].amount").value(hasItem(DEFAULT_AMOUNT.doubleValue())))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PaypalCompletedPayments.class);
        PaypalCompletedPayments paypalCompletedPayments1 = new PaypalCompletedPayments();
        paypalCompletedPayments1.setId(1L);
        PaypalCompletedPayments paypalCompletedPayments2 = new PaypalCompletedPayments();
        paypalCompletedPayments2.setId(paypalCompletedPayments1.getId());
        assertThat(paypalCompletedPayments1).isEqualTo(paypalCompletedPayments2);
        paypalCompletedPayments2.setId(2L);
        assertThat(paypalCompletedPayments1).isNotEqualTo(paypalCompletedPayments2);
        paypalCompletedPayments1.setId(null);
        assertThat(paypalCompletedPayments1).isNotEqualTo(paypalCompletedPayments2);
    }
}
