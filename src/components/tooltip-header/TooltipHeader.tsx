import React, { useMemo } from "react";
import { Tooltip } from "antd";

type ITooltipHeaderProps = {
    cellContent: (inTooltip?: boolean) => JSX.Element,
    name: string,
    position: "leftTop" | "rightTop",
}

const TooltipHeader: React.FC<ITooltipHeaderProps> = ({
    cellContent,
    name,
    position,
}) => {

    const tooltipContent = useMemo(() => (
        <div className="flex flex-column">
            <div className="app-content__cell-tooltip__header">
                {name}
            </div>
            <div className="d-flex flex-column app-content__cell-tooltip__body">
                {cellContent(true)}
            </div>
        </div>
    ), [cellContent, name]);

    return (
        <Tooltip overlayClassName="app-content__cell-tooltip" placement={position} title={tooltipContent}>
            <div className="d-flex flex-column">
                {cellContent()}
            </div>
        </Tooltip>
    )
}

export default TooltipHeader;