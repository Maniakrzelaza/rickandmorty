import React, {useCallback, useEffect, useMemo, useState} from 'react';
import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Switch, withRouter } from "react-router";
import compose from "../hooks/compose-utils";
import { withBreakpointsProvider } from "../hooks/withBreakpoints";
import AppContent from "./AppContent";
import locationService from "../data/location-service";
import episodeService from "../data/episode-service";
import overrideDataService from '../data/override-data-service';

const App: React.FC = () => {
    const [locationsLoaded, setLocationsLoaded] = useState(false);
    const [episodesLoaded, setEpisodesLoaded] = useState(true);

    const dataLoaded = useMemo(() => {
        return locationsLoaded && episodesLoaded;
    }, [episodesLoaded, locationsLoaded]);

    const setLocationsLoadedCallback = useCallback(() => setLocationsLoaded(true), []);
    const setEpisodesLoadedCallback = useCallback(() => setEpisodesLoaded(true), []);

    useEffect(() => {
        locationService.on(setLocationsLoadedCallback);
        episodeService.on(setEpisodesLoadedCallback);
        locationService.init();
        episodeService.init();
        overrideDataService.init();

        return () => {
            locationService.off(setLocationsLoadedCallback);
            episodeService.off(setEpisodesLoadedCallback);
        }
    }, [])

    return (
        <div className="app">
            <div className="app-root-content">
                <Switch>
                    <Route render={() => <AppContent dataLoaded={dataLoaded} />} />
                </Switch>
            </div>
        </div>
    );
}

export default compose<{}>(
    App,
    withBreakpointsProvider(),
    withRouter,
);
