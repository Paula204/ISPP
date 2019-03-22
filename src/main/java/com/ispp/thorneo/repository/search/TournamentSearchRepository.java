package com.ispp.thorneo.repository.search;

import com.ispp.thorneo.domain.Tournament;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Tournament entity.
 */
public interface TournamentSearchRepository extends ElasticsearchRepository<Tournament, Long> {
}
