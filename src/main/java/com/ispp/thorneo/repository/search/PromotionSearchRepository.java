package com.ispp.thorneo.repository.search;

import com.ispp.thorneo.domain.Promotion;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Promotion entity.
 */
public interface PromotionSearchRepository extends ElasticsearchRepository<Promotion, Long> {
}
