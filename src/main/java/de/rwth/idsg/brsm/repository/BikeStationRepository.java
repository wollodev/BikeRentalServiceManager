package de.rwth.idsg.brsm.repository;

import de.rwth.idsg.brsm.domain.BikeStation;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Spring Data JPA repository for the BikeStation entity.
 */
public interface BikeStationRepository extends JpaRepository<BikeStation, Long> {

}
