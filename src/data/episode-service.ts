import { getEpisodes } from "rickmortyapi";
import keyBy from "lodash/keyBy"
import { Episode } from "rickmortyapi/dist/interfaces";
import localstorageService from "./localstorage-service";
import EventEmitter from "eventemitter3";

const Key = "episodes"
enum EpisodesEvents {
    EpisodesLoaded = "episodes-loaded",
}

type EpisodeById = { [id: string]: Episode };

class EpisodeService {
    initialized = false;
    episodes: EpisodeById = null;
    eventEmitter = new EventEmitter<EpisodesEvents>();

    init = () => {
        const episodes = localstorageService.read<EpisodeById>(Key);
        if (episodes) {
            this.episodes = episodes;
            this.initialized = true;
            this.eventEmitter.emit(EpisodesEvents.EpisodesLoaded);
        } else {
            this.fetchAllEpisodes();
        }
    }

    on = (callback: () => void) => {
        this.eventEmitter.on(EpisodesEvents.EpisodesLoaded, callback);
    }

    off = (callback: () => void) => {
        this.eventEmitter.off(EpisodesEvents.EpisodesLoaded, callback);
    }

    fetchAllEpisodes = () => {
        Promise.all([...Array.from({ length: 3 }, (_, i) => i + 1)].map((page: number) => {
            return getEpisodes({ page });
        })).then(values => {
            const episodes = values.reduce((acc, episodeData) => ({
                ...acc,
                ...keyBy(episodeData.data.results, (ep: Episode) => ep.id),
            }), {});
            this.episodes = episodes;
            localstorageService.write(Key, episodes);
            this.initialized = true;
            this.eventEmitter.emit(EpisodesEvents.EpisodesLoaded);
        })
    }

    getName = (url: string): string => {
        return this.getByUrl(url)?.name ?? "";
    }

    getByUrl = (url: string): Episode => {
        const id = url.replace("https://rickandmortyapi.com/api/episode/", "")
        return this.episodes?.[id]
    }
}

const episodeService = new EpisodeService();

export default episodeService;