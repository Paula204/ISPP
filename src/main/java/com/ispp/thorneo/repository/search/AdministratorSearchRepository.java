package com.ispp.thorneo.repository.search;

import com.ispp.thorneo.domain.Administrator;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Administrator entity.
 */
public interface AdministratorSearchRepository extends ElasticsearchRepository<Administrator, Long> {
}
