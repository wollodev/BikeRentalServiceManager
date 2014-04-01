package de.rwth.idsg.brsm.repository;

import de.rwth.idsg.brsm.domain.BikeStation;
import de.rwth.idsg.brsm.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * Spring Data JPA repository for the BikeStation entity.
 */
public interface BikeStationRepository extends JpaRepository<BikeStation, Long> {

    List<BikeStation> findByUser(User user);

}
