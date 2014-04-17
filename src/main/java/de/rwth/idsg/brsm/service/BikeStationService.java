package de.rwth.idsg.brsm.service;

import de.rwth.idsg.brsm.domain.Bike;
import de.rwth.idsg.brsm.domain.BikeStation;
import de.rwth.idsg.brsm.domain.BikeType;
import de.rwth.idsg.brsm.repository.BikeRepository;
import de.rwth.idsg.brsm.repository.BikeStationRepository;
import de.rwth.idsg.brsm.web.rest.dto.BikeStationDetailDTO;
import de.rwth.idsg.brsm.web.rest.dto.BikeTypeDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
@Transactional
public class BikeStationService {

    private final Logger log = LoggerFactory.getLogger(BikeStationService.class);

    @Autowired
    private BikeStationRepository bikeStationRepository;


    public BikeStationDetailDTO getBikeStationDetails(long id) {

        BikeStation bikeStation = bikeStationRepository.findOne(id);

        String address = bikeStation.getAddressStreet() + ", " + bikeStation.getAddressZip() + " " + bikeStation.getAddressCity();

        HashMap<String, BikeTypeDTO> bikeTypes = new HashMap<>();

        // create biketypeDTO >> Performance Issue >> SQL-QUERY!
        for(Bike bike : bikeStation.getBikes())
        if (!bikeTypes.containsKey(bike.getBikeType().getType())) {
            BikeTypeDTO bikeTypeDTO;
            if (bike.isRented()) {
                bikeTypeDTO = new BikeTypeDTO(bike.getBikeType().getType(), 1, 0);
            } else {
                bikeTypeDTO = new BikeTypeDTO(bike.getBikeType().getType(), 1, 1);
            }

            bikeTypes.put(bike.getBikeType().getType(), bikeTypeDTO);

        } else {
            BikeTypeDTO bikeTypeDTO = bikeTypes.get(bike.getBikeType().getType());
            if (bike.isRented()) {
                bikeTypeDTO.setNumberBikes(bikeTypeDTO.getNumberBikes()+1);
            } else {
                bikeTypeDTO.setNumberBikes(bikeTypeDTO.getNumberBikes()+1);
                bikeTypeDTO.setNumberAvailableBikes(bikeTypeDTO.getNumberAvailableBikes()+1);
            }
        }

        List<BikeTypeDTO> listBikeTypes = new ArrayList<BikeTypeDTO>(bikeTypes.values());

        BikeStationDetailDTO bikeStationDetailDTO = new BikeStationDetailDTO(bikeStation.getName(),address, bikeStation.getOpeningHours(), bikeStation.getNumberOfAvailableBikes(), bikeStation.getNumberOfBikes(), listBikeTypes);


        return bikeStationDetailDTO;
    }


}
