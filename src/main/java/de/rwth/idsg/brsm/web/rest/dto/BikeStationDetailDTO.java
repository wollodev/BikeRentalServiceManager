package de.rwth.idsg.brsm.web.rest.dto;

import java.util.List;

/**
 * Created by swam on 16/04/14.
 */
public class BikeStationDetailDTO {

    private String name;
    private String address;
    private String openingTime;
    private int numberAvailableBikes;
    private int numberBikes;
    private List<BikeTypeDTO> bikeTypes;


    public BikeStationDetailDTO() {}

    public BikeStationDetailDTO(String name, String address, String openingTime, int numberAvailableBikes, int numberBikes, List<BikeTypeDTO> bikeTypes) {
        this.name = name;
        this.address = address;
        this.openingTime = openingTime;
        this.numberAvailableBikes = numberAvailableBikes;
        this.numberBikes = numberBikes;
        this.bikeTypes = bikeTypes;

    }

    public int getNumberBikes() {
        return numberBikes;
    }

    public void setNumberBikes(int numberBikes) {
        this.numberBikes = numberBikes;
    }

    public int getNumberAvailableBikes() {
        return numberAvailableBikes;
    }

    public void setNumberAvailableBikes(int numberAvailableBikes) {
        this.numberAvailableBikes = numberAvailableBikes;
    }

    public String getOpeningTime() {
        return openingTime;
    }

    public void setOpeningTime(String openingTime) {
        this.openingTime = openingTime;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<BikeTypeDTO> getBikeTypes() {
        return bikeTypes;
    }

    public void setBikeTypes(List<BikeTypeDTO> bikeTypes) {
        this.bikeTypes = bikeTypes;
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("BikeStationDetailDTO{");
        sb.append("name='").append(name).append('\'');
        sb.append(", address='").append(address).append('\'');
        sb.append(", openingTime='").append(openingTime).append('\'');
        sb.append(", numberAvailableBikes=").append(numberAvailableBikes);
        sb.append(", numberBikes=").append(numberBikes);
        sb.append('}');
        return sb.toString();
    }

}
