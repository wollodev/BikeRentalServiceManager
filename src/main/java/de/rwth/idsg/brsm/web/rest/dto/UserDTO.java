package de.rwth.idsg.brsm.web.rest.dto;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

public class UserDTO {

    private final Logger log = LoggerFactory.getLogger(UserDTO.class);

    private String login;
    
    private String firstName;
    
    private String lastName;
    
    private String email;


    private Map<String, Boolean> roles;

    public UserDTO() {}

    public UserDTO(String login, String firstName, String lastName, String email, Map<String, Boolean> roles) {
        this.login = login;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.roles = roles;

        log.info("Created user dto: {}", this);
    }

    public String getLogin() {
        return login;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public Map<String, Boolean> getRoles() {
        return roles;
    }


    public void setLogin(String login) {
        this.login = login;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setRoles(Map<String, Boolean> roles) {
        this.roles = roles;
    }

    @Override
    public String toString() {
        return "UserDTO{" +
                "email='" + email + '\'' +
                ", login='" + login + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                '}';
    }
}
