package com.ispp.thorneo.security;

/**
 * Constants for Spring Security authorities.
 */
public final class AuthoritiesConstants {

    public static final String ADMIN = "ROLE_ADMIN";

    public static final String USER = "ROLE_FREE";

    public static final String PREMIUM = "ROLE_PREMIUM";

    public static final String SPONSOR = "ROLE_SPONSOR";

    public static final String ANONYMOUS = "ROLE_ANONYMOUS";

    private AuthoritiesConstants() {
    }
}
