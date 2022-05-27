import { IOverrideData } from "./character-model";
import localstorageService from "./localstorage-service";
import { Character } from "rickmortyapi/dist/interfaces";
import EventEmitter from "eventemitter3";

enum OverrideDataEvents {
    OverrideDataChanged = "override-data-changed",
}

class OverrideDataService {
    overrideData: IOverrideData = {}
    eventEmitter = new EventEmitter<OverrideDataEvents>();

    init = () => {
        this.overrideData = localstorageService.readOverrides();
        this.eventEmitter.emit(OverrideDataEvents.OverrideDataChanged);
    }

    on = (callback: () => void) => {
        this.eventEmitter.on(OverrideDataEvents.OverrideDataChanged, callback);
    }

    off = (callback: () => void) => {
        this.eventEmitter.off(OverrideDataEvents.OverrideDataChanged, callback);
    }

    update = (updatedData: IOverrideData) => {
        this.overrideData = {
            ...this.overrideData,
            ...updatedData
        }
        localstorageService.writeOverrides(this.overrideData);
        this.eventEmitter.emit(OverrideDataEvents.OverrideDataChanged);
    }

    mergeDataWithOverrides = (characters: Character[]): Character[] => {
        return characters.reduce((acc: Character[], ch: Character) => {
            const override = this.overrideData[ch.id];
            if (!override?.removed) {
                acc.push({ ...ch, status: override?.status ?? ch.status })
            }
            return acc;
        }, [])
    }
}

const overrideDataService = new OverrideDataService();

export default overrideDataService;