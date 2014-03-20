package de.rwth.idsg.brsm.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.sun.org.apache.xpath.internal.operations.Bool;
import de.rwth.idsg.brsm.domain.Bike;
import de.rwth.idsg.brsm.domain.BikeStation;
import de.rwth.idsg.brsm.repository.BikeRepository;
import de.rwth.idsg.brsm.security.AuthoritiesConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.annotation.security.RolesAllowed;
import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Map;

/**
 * REST controller for managing Bike.
 */
@RolesAllowed(AuthoritiesConstants.MANAGER)
@RestController
@RequestMapping("/app")
public class BikeResource {

    private final Logger log = LoggerFactory.getLogger(BikeResource.class);

    @Autowired
    private BikeRepository bikeRepository;

    /**
     * POST  /rest/bikes -> Create a new bike.
     */
    @RolesAllowed(AuthoritiesConstants.LENDER)
    @RequestMapping(value = "/rest/bikes",
            method = RequestMethod.POST,
            produces = "application/json")
    @Timed
    public void create(@RequestBody Bike bike) {
        log.debug("REST request to save Bike : {}", bike);

        BikeStation bikeStation = bikeRepository.findOne(bike.getId()).getBikeStation();

        if (bikeStation != null) {
            bike.setBikeStation(bikeStation);
        }

        bikeRepository.save(bike);
    }

    @RolesAllowed(AuthoritiesConstants.LENDER)
    @RequestMapping(value = "/rest/bikestations/rentBike",
            method = RequestMethod.POST,
            produces = "application/json")
    @Timed
    public void changeRentState(@PathVariable long id, @RequestParam Boolean state) {
        Bike bike = bikeRepository.findOne(id);
        bike.setRented(state);
        bikeRepository.save(bike);
    }

    /**
     * GET  /rest/bikes -> get all the bikes.
     */
    @RequestMapping(value = "/rest/bikes",
            method = RequestMethod.GET,
            produces = "application/json")
    @Timed
    public List<Bike> getAll() {
        log.debug("REST request to get all Bikes");
        return bikeRepository.findAll();
    }

    /**
     * GET  /rest/bikes/:id -> get the "id" bike.
     */
    @RequestMapping(value = "/rest/bikes/{id}",
            method = RequestMethod.GET,
            produces = "application/json")
    @Timed
    public Bike get(@PathVariable Long id, HttpServletResponse response) {
        log.debug("REST request to get Bike : {}", id);
        Bike bike = bikeRepository.findOne(id);
        if (bike == null) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }
        return bike;
    }

    /**
     * DELETE  /rest/bikes/:id -> delete the "id" bike.
     */
    @RequestMapping(value = "/rest/bikes/{id}",
            method = RequestMethod.DELETE,
            produces = "application/json")
    @Timed
    public void delete(@PathVariable Long id, HttpServletResponse response) {
        log.debug("REST request to delete Bike : {}", id);
//        BikeStation bikeStation = bikeRepository.findOne(id).getBikeStation();
//        if (bikeStation != null) {
//            bikeStation.removeBike(bikeRepository.findOne(id));
//            bikeStationRepository.save(bikeStation);
//        }

        bikeRepository.delete(id);
    }
}
