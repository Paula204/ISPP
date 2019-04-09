package com.ispp.thorneo.repository.search;

import com.ispp.thorneo.domain.PaypalCompletedPayments;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the PaypalCompletedPayments entity.
 */
public interface PaypalCompletedPaymentsSearchRepository extends ElasticsearchRepository<PaypalCompletedPayments, Long> {
}
