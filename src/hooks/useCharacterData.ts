import { getCharacters } from "rickmortyapi";
import { Character, CharacterFilter } from "rickmortyapi/dist/interfaces";
import { useCallback, useEffect, useState } from "react";

type IUseCharactersInfoInput = {
    filters?: CharacterFilter | undefined,
    shouldLoad?: boolean,
};

export type IUseCharactersInfoOutput = {
    loading: boolean,
    characterData: Character[],
}

export const useCharactersData: (input?: IUseCharactersInfoInput) => IUseCharactersInfoOutput = ({
    filters,
    shouldLoad,
}) => {
    const [characterData, setCharacterData] = useState<Character[]>([]);
    const [loading, setLoading] = useState(false);

    const onLoadStart = useCallback(() => setLoading(true), []);
    const onLoadFinish = useCallback(() => setLoading(false), []);

    useEffect(() => {
        if (shouldLoad) {
            onLoadStart();
            Promise.all([...Array.from({ length: 42 }, (_, i) => i + 1)]
                .map((page: number) => getCharacters({  page })))
                .then(values => {
                    const characters = values.reduce((acc, characterData) => {
                        return [
                            ...acc,
                            ...characterData.data.results.map(data => ({
                                ...data,
                                key: data.id,
                            }))
                        ];
                    }, []);
                    setCharacterData(characters ?? [])
                })
                .finally(() => onLoadFinish());
        }
    }, [shouldLoad, filters, onLoadFinish, onLoadStart])

    return {
        loading,
        characterData,
    }
}