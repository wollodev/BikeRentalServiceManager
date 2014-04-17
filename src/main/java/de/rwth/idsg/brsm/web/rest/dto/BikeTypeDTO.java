package de.rwth.idsg.brsm.web.rest.dto;

/**
 * Created by swam on 16/04/14.
 */
public class BikeTypeDTO {

    private String type;
    private int numberBikes;
    private int numberAvailableBikes;

    public BikeTypeDTO() {}

    public BikeTypeDTO(String type, int numberBikes, int numberAvailableBikes) {
        this.type = type;
        this.numberBikes = numberBikes;
        this.numberAvailableBikes = numberAvailableBikes;
    }

    public int getNumberBikes() {
        return numberBikes;
    }

    public void setNumberBikes(int numberBikes) {
        this.numberBikes = numberBikes;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getNumberAvailableBikes() {
        return numberAvailableBikes;
    }

    public void setNumberAvailableBikes(int numberAvailableBikes) {
        this.numberAvailableBikes = numberAvailableBikes;
    }


}
