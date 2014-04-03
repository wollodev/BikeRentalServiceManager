package de.rwth.idsg.brsm.web.rest;

import com.codahale.metrics.annotation.Timed;
import de.rwth.idsg.brsm.domain.User;
import de.rwth.idsg.brsm.repository.UserRepository;
import de.rwth.idsg.brsm.security.AuthoritiesConstants;
import de.rwth.idsg.brsm.service.UserService;
import de.rwth.idsg.brsm.web.rest.dto.UserDTO;
import de.rwth.idsg.brsm.web.rest.dto.UserRegistrationDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

/**
 * REST controller for managing users.
 */
@RestController
@RequestMapping("/app")
public class UserResource {

    private final Logger log = LoggerFactory.getLogger(UserResource.class);

    @Inject
    private UserRepository userRepository;

    @Inject
    private UserService userService;


    /**
     * GET  /rest/users/:login -> get the "login" user.
     */
    @RequestMapping(value = "/rest/users/{login}",
            method = RequestMethod.GET,
            produces = "application/json")
    @Timed
    @RolesAllowed(AuthoritiesConstants.ADMIN)
    public User getUser(@PathVariable String login, HttpServletResponse response) {
        log.debug("REST request to get User : {}", login);
        User user = userRepository.findOne(login);
        if (user == null) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }
        return user;
    }

    /**
     * POST /rest/account/create -> create new user.
     */
    @RequestMapping(value="/rest/users",
            method = RequestMethod.POST,
            produces = "application/json")
    @Timed
    public void createUser(@RequestBody UserRegistrationDTO user) {
        log.debug("REST request to create {}", user);

        userService.createUser(user);
    }

    /**
     * DELETE /rest/users -> remove target user
     * @param user to be deleted
     */
    @RequestMapping(value="/rest/users",
            method = RequestMethod.DELETE,
            produces = "application/json")
    @Timed
    // set to ADMIN out of precaution, change later?
    @RolesAllowed(AuthoritiesConstants.ADMIN)
    public void delete(@RequestBody UserDTO user) {
        log.debug("REST request to delete user: {}", user);

        userService.deleteUser(user.getLogin());
    }
}
