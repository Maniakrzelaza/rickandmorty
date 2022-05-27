import { IWindowBreakpoints, BreakpointRange } from "../models/window.model";

export const sizes: Record<BreakpointRange, { from: number; to: number }> = {
    [BreakpointRange.Xsm]: { from: 0, to: 420 },
    [BreakpointRange.Sm]: { from: 421, to: 720 },
    [BreakpointRange.Md]: { from: 721, to: 1024 },
    [BreakpointRange.Lg]: { from: 1025, to: 1250 },
    [BreakpointRange.Xl]: { from: 1251, to: 1500 },
    [BreakpointRange.Xxl]: { from: 1501, to: 1750 },
    [BreakpointRange.Xxxl]: { from: 1751, to: Infinity },
};

export const getBreakpoint = (breakPoints: Partial<IWindowBreakpoints>): BreakpointRange | null => {
    if (breakPoints?.isXxxlargeUp) {
        return BreakpointRange.Xxxl;
    }
    if (breakPoints?.isXxlargeUp) {
        return BreakpointRange.Xxl;
    }
    if (breakPoints?.isXlargeUp) {
        return BreakpointRange.Xl;
    }
    if (breakPoints?.isLargeUp) {
        return BreakpointRange.Lg;
    }
    if (breakPoints?.isMediumUp) {
        return BreakpointRange.Md;
    }
    if (breakPoints?.isSmallUp) {
        return BreakpointRange.Sm;
    }
    if (breakPoints?.isXsmallUp) {
        return BreakpointRange.Xsm;
    }
    return null;
};