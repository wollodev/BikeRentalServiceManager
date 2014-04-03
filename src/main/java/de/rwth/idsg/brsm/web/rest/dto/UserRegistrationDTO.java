package de.rwth.idsg.brsm.web.rest.dto;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

/**
 * Created by max on 01/04/14.
 */
public class UserRegistrationDTO extends UserDTO {

    private final Logger log = LoggerFactory.getLogger(UserRegistrationDTO.class);

    private String password;

    public UserRegistrationDTO() {}

    public UserRegistrationDTO(String login, String firstName, String lastName, String email, Map<String, Boolean> roles, String password) {
        super(login, firstName,  lastName, email, roles);
        this.password = password;
    }

    public String getPassword() { return password; }

    public void setPassword(String password) { this.password = password; }

    @Override
    public String toString() {
        return "UserRegistrationDTO{" +
                "email='" + this.getEmail() + '\'' +
                ", login='" + this.getLogin() + '\'' +
                ", firstName='" + this.getFirstName() + '\'' +
                ", lastName='" + this.getLastName() + '\'' +
                ", password='" + this.getPassword() + '\'' +
                ", roles='" + this.getRoles() + '\'' +
                '}';
    }

}
