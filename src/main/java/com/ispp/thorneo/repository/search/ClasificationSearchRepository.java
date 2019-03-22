package com.ispp.thorneo.repository.search;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Clasification entity.
 */
public interface ClasificationSearchRepository extends ElasticsearchRepository<Clasification, Long> {
}
