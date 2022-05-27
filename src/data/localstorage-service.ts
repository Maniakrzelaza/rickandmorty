import { Location, Episode } from "rickmortyapi/dist/interfaces";
import { IOverrideData } from "./character-model";

const Overrides = "overrides"

class LocalstorageService {
    read = <T extends { [key: string]: Location | Episode }>(key: string): T => {
        return JSON.parse(localStorage.getItem(key)) as T;
    }

    write: <T extends { [key: string]: Location | Episode }>(key: string, data: T) => void = (key: string, data: any) => {
        localStorage.setItem(key, JSON.stringify(data));
    }

    readOverrides = (): IOverrideData => {
        const data = JSON.parse(localStorage.getItem(Overrides))
        if (data) {
            return data as IOverrideData
        }
        return {}
    }

    writeOverrides = (data: IOverrideData) => {
        localStorage.setItem(Overrides, JSON.stringify(data));
    }
}

const localstorageService = new LocalstorageService();

export default localstorageService;