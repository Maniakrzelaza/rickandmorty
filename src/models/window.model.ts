export enum BreakpointRange {
    Xsm = "xsm",
    Sm = "sm",
    Md = "md",
    Lg = "lg",
    Xl = "xl",
    Xxl = "xxl",
    Xxxl = "xxxl",
}

export enum BrowserName {
    Opera = "opera",
    Edge = "edge",
    Chrome = "chrome",
    Safari = "safari",
    Firefox = "firefox",
    Ie = "ie",
}

export enum SystemName {
    Windows = "windows",
    Android = "android",
    Linux = "linux",
    iOS = "ios",
    MacOSX = "mac os x",
    SearchBot = "search bot",
    Other = "other",
}

export const mobileSystems = [SystemName.Android, SystemName.iOS];

export enum AppMode {
    Browser = "browser",
    Standalone = "standalone",
}

export interface IBreakpoints {
    isElementXsmallUp: boolean
    isElementSmallUp: boolean
    isElementMediumUp: boolean
    isElementLargeUp: boolean
    isElementXlargeUp: boolean
    isElementXxlargeUp: boolean
    isElementXxxlargeUp: boolean
}

export interface IWindowBreakpoints {
    range: BreakpointRange
    isXsmallUp: boolean
    isSmallUp: boolean
    isMediumUp: boolean
    isLargeUp: boolean
    isXlargeUp: boolean
    isXxlargeUp: boolean
    isXxxlargeUp: boolean
    isKeyboardOpen: boolean
    isPortrait: boolean
}

export interface IWindowBreakpointsState extends IWindowBreakpoints {
    from: number
    to: number
    width: number
    height: number
    dpi: number
    isActual?: boolean
}

export interface IBrowserData {
    name: BrowserName
    mode: AppMode
    system: SystemName
}

export interface IWindowBrowser extends IBrowserData {
    isTouch: boolean
    isActual: boolean
}

export interface IWindowBreakpointsWithViewportDimensions extends IWindowBreakpoints, IViewPortDimensions {}

export type IViewPortDimensions = {
    viewPortWidth: number | undefined;
    viewPortHeight: number | undefined;
}

export type IWindowDimensions = {
    width: number | undefined;
    height: number | undefined;
};

export interface IWindowState {
    readonly breakpoints: IWindowBreakpointsState
    readonly browser: IWindowBrowser
}

export type ListenToWindowSizesCallback = (breakpoints: IWindowBreakpointsState) => void