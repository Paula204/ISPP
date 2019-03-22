package com.ispp.thorneo.repository.search;

import com.ispp.thorneo.domain.Authority;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Authority entity.
 */
public interface AuthoritySearchRepository extends ElasticsearchRepository<Authority, Long> {
}
