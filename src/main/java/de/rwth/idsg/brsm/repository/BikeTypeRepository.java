package de.rwth.idsg.brsm.repository;

import de.rwth.idsg.brsm.domain.BikeType;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Created by swam on 16/04/14.
 */
public interface BikeTypeRepository extends JpaRepository<BikeType, Long> {

}
