package de.rwth.idsg.brsm.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import java.io.Serializable;

/**
 * A Bike.
 */
@Entity
@Table(name = "T_BIKE", uniqueConstraints = @UniqueConstraint(columnNames = {"tag", "bike_station_id"}))
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Bike implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "tag")
    private String tag;

    @Column(name = "is_rented")
    private boolean isRented;

    @Column(name = "note")
    private String note;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name="bike_station_id")
    private BikeStation bikeStation;

    @ManyToOne
    @JoinColumn(name="type_id")
    private BikeType bikeType;

    public BikeStation getBikeStation() {
        return bikeStation;
    }

    public void setBikeStation(BikeStation bikeStation) {
        this.bikeStation = bikeStation;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getBikeStationId() {
        if (bikeStation == null) {
            return 0;
        }
        return bikeStation.getId();
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public boolean isRented() {
        return isRented;
    }

    public void setRented(boolean isRented) {
        this.isRented = isRented;
    }

    public BikeType getBikeType() {
        return bikeType;
    }

    public void setBikeType(BikeType bikeType) {
        this.bikeType = bikeType;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Bike bike = (Bike) o;

        if (id != bike.id) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return (int) (id ^ (id >>> 32));
    }

    @Override
    public String toString() {
        return "Bike{" +
                "id=" + id + '\'' +
                "isRented=" + isRented + '\'' +
                ", tag='" + tag +
                '}';
    }
}
