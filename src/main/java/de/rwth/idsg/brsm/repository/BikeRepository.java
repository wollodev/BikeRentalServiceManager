package de.rwth.idsg.brsm.repository;

import de.rwth.idsg.brsm.domain.Bike;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Spring Data JPA repository for the Bike entity.
 */
public interface BikeRepository extends JpaRepository<Bike, Long> {

}
