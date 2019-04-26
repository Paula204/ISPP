package com.ispp.thorneo.repository.search;

import com.ispp.thorneo.domain.Puntuation;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Puntuation entity.
 */
public interface PuntuationSearchRepository extends ElasticsearchRepository<Puntuation, Long> {
}
