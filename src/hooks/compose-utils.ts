import * as React from "react";
import { ComponentType } from "react";

type HigherOrderComponentFactoryFunction = (InnerComponent: ComponentType<any>, ...parameters: any[]) => ComponentType<any>;

const isDisplayNameSet = (firstFactoryFnOrDisplayName: HigherOrderComponentFactoryFunction | string): firstFactoryFnOrDisplayName is string => typeof firstFactoryFnOrDisplayName === "string";

const compose = <P = {}>(
    InnerComponent: React.ComponentType<P>,
    firstFactoryFunctionOrDisplayName: HigherOrderComponentFactoryFunction | string,
    ...hocFactoryFunctions: HigherOrderComponentFactoryFunction[]
): React.ComponentType<P> => {
    const factoryFunctions = isDisplayNameSet(firstFactoryFunctionOrDisplayName) ?
        hocFactoryFunctions : [firstFactoryFunctionOrDisplayName, ...hocFactoryFunctions];

    const ComposedInnerComponent = factoryFunctions.reduce((extendedInnerComponent, hocFactoryFunction) => {
        return hocFactoryFunction(extendedInnerComponent);
    }, InnerComponent);

    if (isDisplayNameSet(firstFactoryFunctionOrDisplayName)) {
        ComposedInnerComponent.displayName = firstFactoryFunctionOrDisplayName;
    }

    return ComposedInnerComponent;
};

export default compose;