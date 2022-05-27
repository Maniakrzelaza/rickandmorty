import {createContext, FC, ReactNode, useCallback, useEffect, useMemo, useState} from "react";
import {IWindowBreakpoints, IWindowBreakpointsWithViewportDimensions, IWindowDimensions} from "../models/window.model";
import windowService from "./window.service";

export interface IWithBreakpointsOptions<T extends boolean = false> {
    getViewPortDimensions?: T
}

export type Subtract<T, K> = Omit<T, keyof K>;

type IWindowBreakpointsByOptions<T> = T extends true ? IWindowBreakpointsWithViewportDimensions : IWindowBreakpoints;

export type IWithBreakpointsProps<T extends boolean = false> = IWindowBreakpointsByOptions<T> & {
    children?: ReactNode
}

export const BreakPointsContext = createContext<IWindowDimensions>(windowService.getDefaultBreakPoints());

export const withBreakpoints = <P extends IWithBreakpointsProps<B>, B extends boolean = false>({
                                                                                                   getViewPortDimensions,
                                                                                               }: IWithBreakpointsOptions<B> = {}) => (InnerComponent: React.ComponentType<P>) => {
    const WithBreakpoints: FC<Subtract<P, IWindowBreakpointsByOptions<B>>> = (props) => {
        const renderConsumer = useCallback((dimensions: IWindowDimensions) => {
            const breakpoints = { ...windowService.mapDimensionsToBrakePoints({ width: dimensions?.width, height: dimensions?.height }) };

            if (getViewPortDimensions !== true) {
                delete breakpoints.viewPortHeight;
                delete breakpoints.viewPortWidth;
            }

            return (
                <InnerComponent
                    {...props as any}
                    {...breakpoints}
                />
            );
        }, [props]);

        return (
            <BreakPointsContext.Consumer>
                {renderConsumer}
            </BreakPointsContext.Consumer>
        )
    }

    return WithBreakpoints;
};

export const withBreakpointsProvider = <P extends {}>() => {
    return (InnerComponent: React.ComponentType<P>): FC<P> => (props: P) => {
        const initialState = useMemo(() => ({
            width: windowService.getBreakPoints().viewPortWidth,
            height: windowService.getBreakPoints().viewPortHeight,
        }), []);

        const [breakPoints, setBreakPoints] = useState<IWindowDimensions>(initialState);

        const setBreakPointsCallback = useCallback((data: IWindowDimensions) => {
            setBreakPoints(data);
            windowService.changeWindowDimension(data);
        }, [setBreakPoints])

        useEffect(() => {
            windowService.on(setBreakPointsCallback);
            return () => windowService.off(setBreakPointsCallback);
        }, [setBreakPointsCallback]);

        return (
            <BreakPointsContext.Provider
                value={breakPoints}
            >
                <InnerComponent {...props as P} />
            </BreakPointsContext.Provider>
        )
    }
}