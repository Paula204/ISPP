package com.ispp.thorneo.repository.search;

import com.ispp.thorneo.domain.Punctuation;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Punctuation entity.
 */
public interface PunctuationSearchRepository extends ElasticsearchRepository<Punctuation, Long> {
}
