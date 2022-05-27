import { getLocations } from "rickmortyapi";
import keyBy from "lodash/keyBy"
import { Location } from "rickmortyapi/dist/interfaces";
import localstorageService from "./localstorage-service";
import EventEmitter from "eventemitter3";

const Key = "locations"
enum LocationEvents {
    LocationLoaded = "location-loaded",
}

class LocationService {
    initialized = false;
    locations = null;
    eventEmitter = new EventEmitter<LocationEvents>();
    locationOptions: string[] = []

    init = () => {
        const locations = localstorageService.read(Key);
        if (locations) {
            this.locations = locations;
            this.locationOptions = [...Object.entries(locations)
                .map(([key, loc]) => loc.name), "unknown"];
            this.initialized = true;
            this.eventEmitter.emit(LocationEvents.LocationLoaded);
        } else {
            this.fetchAllLocations();
        }
    }

    on = (callback: () => void) => {
        this.eventEmitter.on(LocationEvents.LocationLoaded, callback);
    }

    off = (callback: () => void) => {
        this.eventEmitter.off(LocationEvents.LocationLoaded, callback);
    }

    fetchAllLocations = () => {
        Promise.all([...Array.from({ length: 7 }, (_, i) => i + 1)].map((page: number) => {
            return getLocations({ page });
        })).then(values => {
            const locations: { [id: string]: Location } = values.reduce((acc, locationData) => {
                return {
                    ...acc,
                    ...keyBy(locationData.data.results, (loc: Location) => loc.id),
                };
            }, {});

            this.locations = locations;
            this.locationOptions = [...Object.entries(locations)
                .map(([key, loc]) => loc.name), "unknown"];
            localstorageService.write(Key, locations);
            this.initialized = true;
            this.eventEmitter.emit(LocationEvents.LocationLoaded);
        })
    }

    getByUrl = (url: string): Location => {
        const id = url.replace("https://rickandmortyapi.com/api/location/", "")
        return this.locations?.[id]
    }

    getType = (url: string): string => {
        return this.getByUrl(url)?.type ?? "";
    }
}

const locationService = new LocationService();

export default locationService;