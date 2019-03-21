package com.ispp.thorneo.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of FreeSearchRepository to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class FreeSearchRepositoryMockConfiguration {

    @MockBean
    private FreeSearchRepository mockFreeSearchRepository;

}
