package de.rwth.idsg.brsm.repository;

import de.rwth.idsg.brsm.domain.BikeStation;
import de.rwth.idsg.brsm.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

/**
 * Spring Data JPA repository for the BikeStation entity.
 */
public interface BikeStationRepository extends JpaRepository<BikeStation, Long> {

    List<BikeStation> findByUser(User user);

    @Query("SELECT bs FROM BikeStation bs ORDER BY ((6371 * 2 * ASIN(SQRT(POWER(SIN((bs.locationLatitude - abs(:latitude)) * pi()/180 / 2),2) +" +
            "COS(bs.locationLatitude * pi()/180 ) * COS(abs(:latitude) * pi()/180) *" +
            "POWER(SIN((bs.locationLongitude - :longitude) * pi()/180 / 2), 2))))*1000) ASC")
    List<BikeStation> findByLocation(@Param("latitude") BigDecimal latitude, @Param("longitude") BigDecimal longitude);
}

//Query query = getSessionFactory().getCurrentSession().createSQLQ uery("SELECT (6371 * 2 * ASIN(SQRT(POWER(SIN((:ulatitude - abs(latitude)) * pi()/180 / 2),2) +" +
//                                                                              "COS(:ulatitude * pi()/180 ) * COS(abs(latitude) * pi()/180) *" +
//                                                                              "POWER(SIN((:ulongitude - longitude) * pi()/180 / 2), 2))))*1000 as distance " +
//                                                                              "FROM poi HAVING distance < 5000 ORDER BY distance");
//
//query.setParameter("ulongitude", longitude);
//        query.setParameter("ulatitude", latitude);
//        query.setFirstResult((page-1)*10);
//        query.setMaxResults(10);
