import {
    IViewPortDimensions,
    IWindowBreakpointsWithViewportDimensions,
    IWindowDimensions,
} from "../models/window.model";
import EventEmitter from "eventemitter3";
import { getBreakpoint, sizes } from "./window.helpers";

enum WindowServiceEvent {
    Resize = "WindowServiceEvent-resize",
}

enum DeviceType {
    mobile = "mobile",
    tablet = "tablet",
    desktop = "desktop"
}

const defaultDeviceSizes = {
    [DeviceType.mobile]: { width: 411, height: 731 }, // Pixel 2
    [DeviceType.tablet]: { width: 1024, height: 1366 }, // iPad Pro
    [DeviceType.desktop]: { width: 1920, height: 1080 }, // full hd
}

export type CallbackFn<T extends any[] = [], R extends any = void> = (...args: T) => R;

class WindowService {
    private eventEmitter = new EventEmitter<WindowServiceEvent>();
    private windowDimension: IWindowDimensions;
    private _breakpoints: IWindowBreakpointsWithViewportDimensions;

    start = (): IWindowBreakpointsWithViewportDimensions => {
        try {
            const breakPoints: IViewPortDimensions = this.attachWindowSizeListener();
            this.changeScreenSize(breakPoints.viewPortWidth, breakPoints.viewPortHeight);
            return this.mapDimensionsToBrakePoints({ width: breakPoints.viewPortWidth, height: breakPoints.viewPortHeight });

        } catch (e) {
            console.error("Window Service Error", e);
        }
    }

    getDefaultBreakPoints = () => {
        return defaultDeviceSizes.desktop;
    }

    changeWindowDimension = (dim: IWindowDimensions) => {
        this.windowDimension = dim;
        this.updateWindowBreakpoints(dim);
    }

    getBreakPoints = () => {
        if (!this._breakpoints) {
            this._breakpoints = this.mapDimensionsToBrakePoints(this.windowDimension);
        }
        return this._breakpoints;
    }

    on = (callback: CallbackFn<[IWindowDimensions]>) => {
        this.eventEmitter.on(WindowServiceEvent.Resize, callback);
    }

    off = (callback: CallbackFn<[IWindowDimensions]>) => {
        this.eventEmitter.off(WindowServiceEvent.Resize, callback);
    }

    mapDimensionsToBrakePoints<P extends IWindowBreakpointsWithViewportDimensions>(dims: IWindowDimensions): P {
        const { width, height } = dims ?? {};
        if (
            !this._breakpoints
            || !this.windowDimension
            || this.windowDimension.width !== width
            || this.windowDimension.height !== height
            || this._breakpoints.viewPortWidth !== width
            || this._breakpoints.viewPortHeight !== height
        ) {
            this.updateWindowBreakpoints(dims);
        }
        return this._breakpoints as P;
    }

    updateWindowBreakpoints = <P extends IWindowBreakpointsWithViewportDimensions>(dims: IWindowDimensions) => {
        const { width, height } = dims ?? {};
        const partialResult = {
            isKeyboardOpen: false,
            isLargeUp: sizes.lg.from <= width,
            isMediumUp: sizes.md.from <= width,
            isPortrait: height > width,
            isSmallUp: sizes.sm.from <= width,
            isXlargeUp: sizes.xl.from <= width,
            isXsmallUp: sizes.xsm.from <= width,
            isXxlargeUp: sizes.xxl.from <= width,
            isXxxlargeUp: sizes.xxxl.from <= width,
        }
        this._breakpoints = {
            ...partialResult,
            range: getBreakpoint(partialResult),
            viewPortWidth: width,
            viewPortHeight: height,
        } as P;
    }

    changeScreenSize = (width: number, height: number) => {
        this.eventEmitter.emit(WindowServiceEvent.Resize, {
            width,
            height,
        } as IWindowDimensions);
    }

    attachWindowSizeListener = () => {
        if (global.window) {
            function handleResize(): void {
                windowService.changeScreenSize(window.innerWidth, window.innerHeight);
            }
            handleResize();
            window.addEventListener("resize", handleResize);
            return this.mapDimensionsToBrakePoints({ width: window.innerWidth, height: window.innerHeight });
        }
        return null;
    }
}

const windowService = new WindowService()

export default windowService;