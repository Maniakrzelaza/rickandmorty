import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useCharactersData } from "../hooks/useCharacterData";
import { Character } from "rickmortyapi/dist/interfaces";
import compose from "../hooks/compose-utils";
import { withBreakpoints } from "../hooks/withBreakpoints";
import { IWindowBreakpoints } from "../models/window.model";
import { Species, Status } from "../data/character-model";
import overrideDataService from "../data/override-data-service";
import { filterCharacters } from "../data/character-functions";
import TableFilters from "../components/table-filters/TableFilters";
import CharacterTable from "../components/character-table/CharacterTable";

interface IAppContentOwnProps {
    dataLoaded: boolean
}

type IAppContent = IAppContentOwnProps & IWindowBreakpoints;

const AppContent: React.FC<IAppContent> = ({
    dataLoaded,
    isLargeUp,
}) => {
    const [selectedCharacters, setSelectedCharacters] = useState<React.Key[]>([]);
    const [charactersDataToUse, setCharactersDataToUse] = useState<Character[]>([]);
    const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([]);
    const [isEditing, setEditing] = useState(false);
    const [filterText, setFilterText] = useState<string>(null);
    const [filterSpecies, setFilterSpecies] = useState<Species[]>([]);
    const [filterOrigins, setFilterOrigins] = useState<string[]>([]);
    const [filterStatus, setFilterStatus] = useState<Status>(null);

    const onFilterTextChange: (e) => void = useCallback((e) => setFilterText(e.target.value), [setFilterText]);
    const onFilterSpeciesChange: (species: Species[]) => void = useCallback((species: Species[]) => setFilterSpecies(species), [setFilterSpecies]);
    const onFilterOriginsChange: (origins: string[]) => void = useCallback((origins: string[]) => setFilterOrigins(origins), [setFilterOrigins]);
    const onFilterStatusChange: (status: Status) => void = useCallback((status: Status) => setFilterStatus(status), [setFilterStatus]);

    useEffect(() => {
        if (charactersDataToUse.length > 0) {
            const filteredCharacters = filterCharacters({ charactersDataToUse, filterText, filterSpecies, filterOrigins, filterStatus })
            if (!!filteredCharacters) setFilteredCharacters(filteredCharacters);
        }
    }, [filterText, filterSpecies, filterOrigins, filterStatus, charactersDataToUse])

    const numberOfSelectedCharacters = useMemo(() => selectedCharacters.length, [selectedCharacters]);

    const {
        loading,
        characterData,
    } = useCharactersData({ shouldLoad: dataLoaded })

    const mergeOverridesWithCharacters = useCallback(() => {
        setCharactersDataToUse(overrideDataService.mergeDataWithOverrides(characterData));
    }, [setCharactersDataToUse, characterData]);

    useEffect(() => {
        mergeOverridesWithCharacters();
    }, [mergeOverridesWithCharacters]);

    useEffect(() => {
        overrideDataService.on(mergeOverridesWithCharacters)

        return () => overrideDataService.off(mergeOverridesWithCharacters);
    }, [mergeOverridesWithCharacters]);

    const removeCharacters = useCallback(() => {
        const overrideData = selectedCharacters.reduce((acc, id) => {
            return {
                ...acc,
                [id]: { removed: true },
            }
        }, {});
        overrideDataService.update(overrideData);
        setSelectedCharacters([]);
    }, [selectedCharacters, setSelectedCharacters]);

    const toggleEditable = useCallback(() => setEditing(!isEditing), [isEditing]);

    return(
        <div className="app-content">
            <div className="app-content__header">
                <div className="table__title">
                    Characters
                </div>
                <TableFilters
                    numberOfSelectedCharacters={numberOfSelectedCharacters}
                    onFilterSpeciesChange={onFilterSpeciesChange}
                    onFilterTextChange={onFilterTextChange}
                    onFilterOriginsChange={onFilterOriginsChange}
                    onFilterStatusChange={onFilterStatusChange}
                    toggleEditable={toggleEditable}
                    removeCharacters={removeCharacters}
                />
            </div>
            <div className="app-content__table">
                <CharacterTable
                    filteredCharacters={filteredCharacters}
                    loading={loading}
                    toggleEditable={toggleEditable}
                    setSelectedCharacters={setSelectedCharacters}
                    isEditing={isEditing}
                    isLargeUp={isLargeUp}
                    selectedCharacters={selectedCharacters}
                />
            </div>
        </div>
    );
}

export default compose<IAppContentOwnProps>(
    AppContent,
    withBreakpoints(),
);

