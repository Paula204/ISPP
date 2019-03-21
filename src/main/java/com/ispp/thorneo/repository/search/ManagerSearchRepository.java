package com.ispp.thorneo.repository.search;

import com.ispp.thorneo.domain.Manager;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Manager entity.
 */
public interface ManagerSearchRepository extends ElasticsearchRepository<Manager, Long> {
}
