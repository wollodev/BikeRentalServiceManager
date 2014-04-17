package de.rwth.idsg.brsm.web.rest;

import com.codahale.metrics.annotation.Timed;
import de.rwth.idsg.brsm.domain.BikeType;
import de.rwth.idsg.brsm.repository.BikeTypeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.inject.Inject;
import java.util.List;

/**
 * REST controller for bike types.
 */
@RestController
@RequestMapping("/app")
public class BikeTypeResource {

    private final Logger log = LoggerFactory.getLogger(UserResource.class);

    @Inject
    private BikeTypeRepository bikeTypeRepository;

    /**
     * GET  /rest/bikes -> get all the biketypes.
     */
    @RequestMapping(value = "/rest/biketypes",
            method = RequestMethod.GET,
            produces = "application/json")
    @Timed
    public List<BikeType> getAll() {
        log.debug("REST request to get all Biketypes");
        return bikeTypeRepository.findAll();
    }

}
