package de.rwth.idsg.brsm.web.rest;

import com.codahale.metrics.annotation.Timed;
import de.rwth.idsg.brsm.domain.Authority;
import de.rwth.idsg.brsm.domain.Bike;
import de.rwth.idsg.brsm.domain.BikeStation;
import de.rwth.idsg.brsm.domain.User;
import de.rwth.idsg.brsm.repository.AuthorityRepository;
import de.rwth.idsg.brsm.repository.BikeRepository;
import de.rwth.idsg.brsm.repository.BikeStationRepository;
import de.rwth.idsg.brsm.security.AuthoritiesConstants;
import de.rwth.idsg.brsm.security.SecurityUtils;
import de.rwth.idsg.brsm.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.annotation.security.RolesAllowed;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

/**
 * REST controller for managing BikeStation.
 */
@RolesAllowed(AuthoritiesConstants.MANAGER)
@RestController
@RequestMapping("/app")
public class BikeStationResource {

    private final Logger log = LoggerFactory.getLogger(BikeStationResource.class);

    @Autowired
    private BikeStationRepository bikestationRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private AuthorityRepository authorityRepository;

    /**
     * POST  /rest/bikestations -> Create a new bikestation.
     */
    // ATTENTION: changed to make station creation work again (max@25.03.14)
    @RolesAllowed(AuthoritiesConstants.LENDER) // was LENDER
    @RequestMapping(value = "/rest/bikestations",
            method = RequestMethod.POST,
            produces = "application/json")
    @Timed
    public void create(@RequestBody BikeStation bikestation, HttpServletResponse response) {
        User currentUser = userService.getUserWithAuthorities();

        // only owner of the bikestation can change an existing bikestation
        if (bikestation.getId() > 0 && currentUser.equals(bikestation.getUser())) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        }

        bikestation.setUser(currentUser);
        log.debug("REST request: to save BikeStation : {}", bikestation);
        bikestationRepository.save(bikestation);
    }

    /**
     * POST  /rest/bikestations/{id}/addBike -> Create add new bike to bikestation.
     */
    @RolesAllowed(AuthoritiesConstants.MANAGER)
    @RequestMapping(value = "/rest/bikestations/{id}/addBike",
            method = RequestMethod.POST,
            produces = "application/json")
    @Timed
    public void addBike(@PathVariable ("id") long bikeStationId, @RequestBody Bike bike) {
        log.debug("REST request to add Bike : {}", bike);
        BikeStation bikeStation = bikestationRepository.findOne(bikeStationId);
        bikeStation.addBike(bike);
        bikestationRepository.save(bikeStation);
    }

    @RolesAllowed({AuthoritiesConstants.ANONYMOUS, AuthoritiesConstants.USER})
    @RequestMapping(value = "/rest/allbikestations",
            method = RequestMethod.GET,
            produces = "application/json")
    @Timed
    public List<BikeStation> getStations() {
        log.debug("REST request to get all BikeStations");

        return bikestationRepository.findAll();
    }

    /**
     * GET  /rest/bikestations -> get all the bikestations.
     */
    @RolesAllowed({AuthoritiesConstants.ANONYMOUS, AuthoritiesConstants.USER}) // was LENDER
    @RequestMapping(value = "/rest/bikestations",
            method = RequestMethod.GET,
            produces = "application/json")
    @Timed
    public List<BikeStation> getAll() {
        log.debug("REST request to get all BikeStations");

        if (!SecurityUtils.isAuthenticated()) {
            return bikestationRepository.findAll();
        }

        User currentUser = userService.getUserWithAuthorities();


        // when currentuser is manager, return all his stations
        if (currentUser.getAuthorities().contains(authorityRepository.findOne(AuthoritiesConstants.MANAGER))) {
            return bikestationRepository.findByUser(currentUser);
        }

        // return stations of the lender's manager
        return bikestationRepository.findByUser(currentUser.getManager());

    }

    /**
     * GET  /rest/bikestations/:id -> get the "id" bikestation.
     */
    @RolesAllowed(AuthoritiesConstants.LENDER) // was LENDER
    @RequestMapping(value = "/rest/bikestations/{id}",
            method = RequestMethod.GET,
            produces = "application/json")
    @Timed
    public BikeStation get(@PathVariable Long id, HttpServletResponse response) {
        log.debug("REST request to get BikeStation : {}", id);
        BikeStation bikestation = bikestationRepository.findOne(id);
        if (bikestation == null) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }
        return bikestation;
    }

    /**
     * DELETE  /rest/bikestations/:id -> delete the "id" bikestation.
     */
    @RequestMapping(value = "/rest/bikestations/{id}",
            method = RequestMethod.DELETE,
            produces = "application/json")
    @Timed
    public void delete(@PathVariable Long id, HttpServletResponse response) {
        log.debug("REST request to delete BikeStation : {}", id);
        bikestationRepository.delete(id);
    }
}
