package de.rwth.idsg.brsm.security;

/**
 * Constants for Spring Security authorities.
 */
public final class AuthoritiesConstants {

    private AuthoritiesConstants() {
    }

    public static final String ADMIN = "ROLE_ADMIN";

    public static final String USER = "ROLE_USER";

    public static final String LENDER = "ROLE_LENDER";

    public static final String ANONYMOUS = "ROLE_ANONYMOUS";
}
