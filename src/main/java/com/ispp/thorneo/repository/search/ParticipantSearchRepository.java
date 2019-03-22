package com.ispp.thorneo.repository.search;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Participant entity.
 */
public interface ParticipantSearchRepository extends ElasticsearchRepository<Participant, Long> {
}
