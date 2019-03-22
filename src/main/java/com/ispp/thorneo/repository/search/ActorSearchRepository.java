package com.ispp.thorneo.repository.search;

import com.ispp.thorneo.domain.Actor;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Actor entity.
 */
public interface ActorSearchRepository extends ElasticsearchRepository<Actor, Long> {
}
