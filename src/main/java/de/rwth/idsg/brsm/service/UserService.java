package de.rwth.idsg.brsm.service;

import de.rwth.idsg.brsm.domain.Authority;
import de.rwth.idsg.brsm.domain.PersistentToken;
import de.rwth.idsg.brsm.domain.User;
import de.rwth.idsg.brsm.repository.AuthorityRepository;
import de.rwth.idsg.brsm.repository.PersistentTokenRepository;
import de.rwth.idsg.brsm.repository.UserRepository;
import de.rwth.idsg.brsm.security.AuthoritiesConstants;
import de.rwth.idsg.brsm.security.SecurityUtils;
import de.rwth.idsg.brsm.web.rest.dto.UserRegistrationDTO;
import org.joda.time.LocalDate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Service class for managing users.
 */
@Service
@Transactional
public class UserService {

    private final Logger log = LoggerFactory.getLogger(UserService.class);

    @Inject
    private PasswordEncoder passwordEncoder;

    @Inject
    private UserRepository userRepository;

    @Inject
    private PersistentTokenRepository persistentTokenRepository;

    @Inject
    private AuthorityRepository authorityRepository;

    public void createUser(UserRegistrationDTO user) {
        User newUser = new User();
        newUser.setFirstName(user.getFirstName());
        newUser.setLastName(user.getLastName());
        newUser.setLogin(user.getLogin().toLowerCase());
        newUser.setEmail(user.getEmail());
        String encryptedPassword = passwordEncoder.encode(user.getPassword());
        newUser.setPassword(encryptedPassword);


        User currentUser = this.getUserWithAuthorities();
        Set<Authority> authorities = currentUser.getAuthorities();

        for (Authority authority : authorities) {
            if (authority.getName().equals(AuthoritiesConstants.MANAGER)) {

                newUser.setManager(currentUser);

                Set authoritySet = new HashSet();
                authoritySet.add(authorityRepository.findOne(AuthoritiesConstants.LENDER));
                authoritySet.add(authorityRepository.findOne(AuthoritiesConstants.USER));

                newUser.setAuthorities(authoritySet);

                userRepository.save(newUser);

                log.debug("Created new user {}", newUser);

                return;
            }
        }

        Set authoritySet = new HashSet();
        authoritySet.add(authorityRepository.findOne(AuthoritiesConstants.MANAGER));
        authoritySet.add(authorityRepository.findOne(AuthoritiesConstants.LENDER));
        authoritySet.add(authorityRepository.findOne(AuthoritiesConstants.USER));

        newUser.setAuthorities(authoritySet);

        userRepository.save(newUser);

        log.debug("Created new user {}", newUser);
    }

    public void deleteUser(String login) {
        User target = userRepository.findOne(login);
        userRepository.delete(target);
        log.debug("Deleted User: {}", login);
    }

    public void updateUserInformation(String firstName, String lastName, String email) {
        User currentUser = userRepository.findOne(SecurityUtils.getCurrentLogin());
        currentUser.setFirstName(firstName);
        currentUser.setLastName(lastName);
        currentUser.setEmail(email);
        userRepository.save(currentUser);
        log.debug("Changed Information for User: {}", currentUser);
    }

    public void changePassword(String password) {
        User currentUser = userRepository.findOne(SecurityUtils.getCurrentLogin());
        String encryptedPassword = passwordEncoder.encode(password);
        currentUser.setPassword(encryptedPassword);
        userRepository.save(currentUser);
        log.debug("Changed password for User: {}", currentUser);
    }

    @Transactional(readOnly = true)
    public User getUserWithAuthorities() {
        User currentUser = userRepository.findOne(SecurityUtils.getCurrentLogin());
        currentUser.getAuthorities().size(); // eagerly load the association
        return currentUser;
    }

    /**
     * Persistent Token are used for providing automatic authentication, they should be automatically deleted after
     * 30 days.
     * <p/>
     * <p>
     * This is scheduled to get fired everyday, at midnight.
     * </p>
     */
    @Scheduled(cron = "0 0 0 * * ?")
    public void removeOldPersistentTokens() {
        LocalDate now = new LocalDate();
        List<PersistentToken> tokens = persistentTokenRepository.findByTokenDateBefore(now.minusMonths(1));
        for (PersistentToken token : tokens) {
            log.debug("Deleting token {}", token.getSeries());
            User user = token.getUser();
            user.getPersistentTokens().remove(token);
            persistentTokenRepository.delete(token);
        }
    }
}
