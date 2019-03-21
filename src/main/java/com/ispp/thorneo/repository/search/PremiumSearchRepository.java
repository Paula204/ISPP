package com.ispp.thorneo.repository.search;

import com.ispp.thorneo.domain.Premium;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Premium entity.
 */
public interface PremiumSearchRepository extends ElasticsearchRepository<Premium, Long> {
}
