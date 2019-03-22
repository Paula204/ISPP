package com.ispp.thorneo.repository.search;

import com.ispp.thorneo.domain.Free;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Free entity.
 */
public interface FreeSearchRepository extends ElasticsearchRepository<Free, Long> {
}
