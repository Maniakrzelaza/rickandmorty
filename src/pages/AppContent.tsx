import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useCharactersData } from "../hooks/useCharacterData";
import { Character } from "rickmortyapi/dist/interfaces";
import compose from "../hooks/compose-utils";
import { withBreakpoints } from "../hooks/withBreakpoints";
import { IWindowBreakpoints } from "../models/window.model";
import overrideDataService from "../data/override-data-service";
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
    const [charactersDataWithOverrides, setCharactersDataWithOverrides] = useState<Character[]>([]);
    const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([]);
    const [isEditing, setEditing] = useState(false);
    const numberOfSelectedCharacters = useMemo(() => selectedCharacters.length, [selectedCharacters]);

    const {
        loading,
        characterData,
    } = useCharactersData({ shouldLoad: dataLoaded })

    const mergeOverridesWithCharacters = useCallback(() => {
        setCharactersDataWithOverrides(overrideDataService.mergeDataWithOverrides(characterData));
    }, [setCharactersDataWithOverrides, characterData]);

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
                    setFilteredCharacters={setFilteredCharacters}
                    charactersDataToUse={charactersDataWithOverrides}
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

