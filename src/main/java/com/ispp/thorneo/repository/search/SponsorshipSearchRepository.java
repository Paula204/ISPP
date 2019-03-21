package com.ispp.thorneo.repository.search;

import com.ispp.thorneo.domain.Sponsorship;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Sponsorship entity.
 */
public interface SponsorshipSearchRepository extends ElasticsearchRepository<Sponsorship, Long> {
}
