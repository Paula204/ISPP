package com.ispp.thorneo.config;

import java.time.Duration;

import org.ehcache.config.builders.*;
import org.ehcache.jsr107.Eh107Configuration;

import io.github.jhipster.config.jcache.BeanClassLoaderAwareJCacheRegionFactory;
import io.github.jhipster.config.JHipsterProperties;

import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.cloud.client.serviceregistry.Registration;
import org.springframework.context.annotation.*;

@Configuration
@EnableCaching
public class CacheConfiguration {

    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        BeanClassLoaderAwareJCacheRegionFactory.setBeanClassLoader(this.getClass().getClassLoader());
        JHipsterProperties.Cache.Ehcache ehcache =
            jHipsterProperties.getCache().getEhcache();

        jcacheConfiguration = Eh107Configuration.fromEhcacheCacheConfiguration(
            CacheConfigurationBuilder.newCacheConfigurationBuilder(Object.class, Object.class,
                ResourcePoolsBuilder.heap(ehcache.getMaxEntries()))
                .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofSeconds(ehcache.getTimeToLiveSeconds())))
                .build());
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            cm.createCache(com.ispp.thorneo.repository.UserRepository.USERS_BY_LOGIN_CACHE, jcacheConfiguration);
            cm.createCache(com.ispp.thorneo.repository.UserRepository.USERS_BY_EMAIL_CACHE, jcacheConfiguration);
            cm.createCache(com.ispp.thorneo.domain.User.class.getName(), jcacheConfiguration);
            cm.createCache(com.ispp.thorneo.domain.Authority.class.getName(), jcacheConfiguration);
            cm.createCache(com.ispp.thorneo.domain.User.class.getName() + ".authorities", jcacheConfiguration);
            cm.createCache(com.ispp.thorneo.domain.Premium.class.getName(), jcacheConfiguration);
            cm.createCache(com.ispp.thorneo.domain.Premium.class.getName() + ".participants", jcacheConfiguration);
            cm.createCache(com.ispp.thorneo.domain.Premium.class.getName() + ".managers", jcacheConfiguration);
            cm.createCache(com.ispp.thorneo.domain.Free.class.getName(), jcacheConfiguration);
            cm.createCache(com.ispp.thorneo.domain.Free.class.getName() + ".participants", jcacheConfiguration);
            cm.createCache(com.ispp.thorneo.domain.Free.class.getName() + ".managers", jcacheConfiguration);
            cm.createCache(com.ispp.thorneo.domain.Administrator.class.getName(), jcacheConfiguration);
            cm.createCache(com.ispp.thorneo.domain.Sponsor.class.getName(), jcacheConfiguration);
            cm.createCache(com.ispp.thorneo.domain.Sponsor.class.getName() + ".participants", jcacheConfiguration);
            cm.createCache(com.ispp.thorneo.domain.Sponsor.class.getName() + ".managers", jcacheConfiguration);
            cm.createCache(com.ispp.thorneo.domain.Sponsor.class.getName() + ".promotions", jcacheConfiguration);
            cm.createCache(com.ispp.thorneo.domain.Tournament.class.getName(), jcacheConfiguration);
            cm.createCache(com.ispp.thorneo.domain.Tournament.class.getName() + ".sponsorships", jcacheConfiguration);
            cm.createCache(com.ispp.thorneo.domain.Game.class.getName(), jcacheConfiguration);
            cm.createCache(com.ispp.thorneo.domain.Game.class.getName() + ".tournaments", jcacheConfiguration);
            cm.createCache(com.ispp.thorneo.domain.Participant.class.getName(), jcacheConfiguration);
            cm.createCache(com.ispp.thorneo.domain.Clasification.class.getName(), jcacheConfiguration);
            cm.createCache(com.ispp.thorneo.domain.Sponsorship.class.getName(), jcacheConfiguration);
            cm.createCache(com.ispp.thorneo.domain.Promotion.class.getName(), jcacheConfiguration);
            cm.createCache(com.ispp.thorneo.domain.Manager.class.getName(), jcacheConfiguration);
            cm.createCache(com.ispp.thorneo.domain.Manager.class.getName() + ".tournaments", jcacheConfiguration);
            cm.createCache(com.ispp.thorneo.domain.UserAccount.class.getName(), jcacheConfiguration);
            cm.createCache(com.ispp.thorneo.domain.Actor.class.getName(), jcacheConfiguration);
            cm.createCache(com.ispp.thorneo.domain.Premium.class.getName() + ".", jcacheConfiguration);
            cm.createCache(com.ispp.thorneo.domain.Premium.class.getName() + ".tournaments", jcacheConfiguration);
            cm.createCache(com.ispp.thorneo.domain.Free.class.getName() + ".", jcacheConfiguration);
            cm.createCache(com.ispp.thorneo.domain.Free.class.getName() + ".tournaments", jcacheConfiguration);
            cm.createCache(com.ispp.thorneo.domain.Sponsor.class.getName() + ".", jcacheConfiguration);
            cm.createCache(com.ispp.thorneo.domain.Sponsor.class.getName() + ".sponsorships", jcacheConfiguration);
            cm.createCache(com.ispp.thorneo.domain.Sponsor.class.getName() + ".tournaments", jcacheConfiguration);
            cm.createCache(com.ispp.thorneo.domain.Tournament.class.getName() + ".participants", jcacheConfiguration);
            cm.createCache(com.ispp.thorneo.domain.Tournament.class.getName() + ".premiums", jcacheConfiguration);
            cm.createCache(com.ispp.thorneo.domain.Tournament.class.getName() + ".frees", jcacheConfiguration);
            cm.createCache(com.ispp.thorneo.domain.Tournament.class.getName() + ".sponsors", jcacheConfiguration);
            cm.createCache(com.ispp.thorneo.domain.Actor.class.getName() + ".participations", jcacheConfiguration);
            cm.createCache(com.ispp.thorneo.domain.Participation.class.getName(), jcacheConfiguration);
            // jhipster-needle-ehcache-add-entry
        };
    }
}
