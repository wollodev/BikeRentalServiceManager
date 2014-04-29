/*
 * Copyright 2014 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package de.rwth.idsg.brsm.config;

import de.rwth.idsg.brsm.security.AuthoritiesConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.config.annotation.configurers.ClientDetailsServiceConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configuration.AuthorizationServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerEndpointsConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.token.InMemoryTokenStore;
import org.springframework.security.oauth2.provider.token.TokenStore;

@Configuration
public class OAuth2ServerConfiguration {

	private static final String RESOURCE_ID = "restservice";

	@Configuration
	@EnableResourceServer
    @EnableWebSecurity
	protected static class ResourceServerConfiguration extends
			ResourceServerConfigurerAdapter {

		@Override
		public void configure(ResourceServerSecurityConfigurer resources) {
			// @formatter:off
			resources
				.resourceId(RESOURCE_ID);
			// @formatter:on
		}

		@Override
		public void configure(HttpSecurity http) throws Exception {
			// @formatter:off
            http
                .formLogin()
                    .loginProcessingUrl("/app/authentication")
                    .usernameParameter("j_username")
                    .passwordParameter("j_password")
                    .permitAll()
                    .and()
                .logout()
                    .logoutUrl("/app/logout")
                    .deleteCookies("JSESSIONID")
                    .permitAll()
                    .and()
                .authorizeRequests()
                    .antMatchers("/app/rest/authenticate").permitAll()
                    .antMatchers("/app/rest/users").permitAll()
                    .antMatchers("/app/rest/allbikestations").permitAll()
                    .antMatchers("/app/rest/bikestationsdetail/**").permitAll()
                    .antMatchers("/app/rest/bikestations*").hasAuthority(AuthoritiesConstants.LENDER)
                    .antMatchers("/app/rest/bikestations/**").hasAuthority(AuthoritiesConstants.LENDER)
                    .antMatchers("/app/rest/logs/**").hasAuthority(AuthoritiesConstants.ADMIN)
                    .antMatchers("/app/**").authenticated()
                    .antMatchers("/websocket/tracker").hasAuthority(AuthoritiesConstants.ADMIN)
                    .antMatchers("/websocket/**").permitAll()
                    .antMatchers("/metrics*").hasAuthority(AuthoritiesConstants.ADMIN)
                    .antMatchers("/metrics/**").hasAuthority(AuthoritiesConstants.ADMIN)
                    .antMatchers("/health*").hasAuthority(AuthoritiesConstants.ADMIN)
                    .antMatchers("/health/**").hasAuthority(AuthoritiesConstants.ADMIN)
                    .antMatchers("/trace*").hasAuthority(AuthoritiesConstants.ADMIN)
                    .antMatchers("/trace/**").hasAuthority(AuthoritiesConstants.ADMIN)
                    .antMatchers("/dump*").hasAuthority(AuthoritiesConstants.ADMIN)
                    .antMatchers("/dump/**").hasAuthority(AuthoritiesConstants.ADMIN)
                    .antMatchers("/shutdown*").hasAuthority(AuthoritiesConstants.ADMIN)
                    .antMatchers("/shutdown/**").hasAuthority(AuthoritiesConstants.ADMIN)
                    .antMatchers("/beans*").hasAuthority(AuthoritiesConstants.ADMIN)
                    .antMatchers("/beans/**").hasAuthority(AuthoritiesConstants.ADMIN)
                    .antMatchers("/info*").hasAuthority(AuthoritiesConstants.ADMIN)
                    .antMatchers("/info/**").hasAuthority(AuthoritiesConstants.ADMIN)
                    .antMatchers("/autoconfig*").hasAuthority(AuthoritiesConstants.ADMIN)
                    .antMatchers("/autoconfig/**").hasAuthority(AuthoritiesConstants.ADMIN)
                    .antMatchers("/env*").hasAuthority(AuthoritiesConstants.ADMIN)
                    .antMatchers("/env/**").hasAuthority(AuthoritiesConstants.ADMIN)
                    .antMatchers("/trace*").hasAuthority(AuthoritiesConstants.ADMIN)
                    .antMatchers("/trace/**").hasAuthority(AuthoritiesConstants.ADMIN);
        }

	}

	@Configuration
	@EnableAuthorizationServer
	protected static class AuthorizationServerConfiguration extends
			AuthorizationServerConfigurerAdapter {

		private TokenStore tokenStore = new InMemoryTokenStore();

		@Autowired
		@Qualifier("authenticationManager")
		private AuthenticationManager authenticationManager;

		@Override
		public void configure(AuthorizationServerEndpointsConfigurer endpoints)
				throws Exception {
			// @formatter:off
			endpoints
				.tokenStore(tokenStore)
				.authenticationManager(authenticationManager);
			// @formatter:on
		}

		@Override
		public void configure(ClientDetailsServiceConfigurer clients) throws Exception {
			// @formatter:off
			clients
				.inMemory()
					.withClient("clientapp")
						.authorizedGrantTypes("password")
						.authorities("USER")
						.scopes("read", "write")
						.resourceIds(RESOURCE_ID)
						.secret("123456");
			// @formatter:on
		}

	}

}
