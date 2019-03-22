package com.ispp.thorneo.repository.search;

import com.ispp.thorneo.domain.Participation;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Participation entity.
 */
public interface ParticipationSearchRepository extends ElasticsearchRepository<Participation, Long> {
}
