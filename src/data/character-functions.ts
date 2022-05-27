import { Character } from "rickmortyapi/dist/interfaces";
import { Species, Status } from "./character-model";
import debounce from "lodash/debounce";

type IFilterCharactersInput = {
    charactersDataToUse: Character[],
    filterText: string,
    filterSpecies: Species[],
    filterOrigins: string[],
    filterStatus: Status,
}

export const filterCharacters = debounce(({
     charactersDataToUse,
     filterText,
     filterSpecies,
     filterOrigins,
     filterStatus,
}: IFilterCharactersInput): Character[] => {
    return charactersDataToUse.filter((ch: Character) => {
        return (!filterStatus || ch.status.toLowerCase() === filterStatus.toLowerCase())
            && (!filterText || ch.name.toLowerCase().indexOf(filterText) !== -1)
            && ((filterSpecies?.length ?? 0) === 0 || filterSpecies?.includes(ch.species as Species))
            && ((filterOrigins?.length ?? 0) === 0 || filterOrigins?.includes(ch.origin.name));
    });
}, 100, { leading: true })