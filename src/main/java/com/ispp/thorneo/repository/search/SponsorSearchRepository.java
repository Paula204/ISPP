package com.ispp.thorneo.repository.search;

import com.ispp.thorneo.domain.Sponsor;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Sponsor entity.
 */
public interface SponsorSearchRepository extends ElasticsearchRepository<Sponsor, Long> {
}
