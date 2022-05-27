import React, { useMemo } from "react";
import alive from "assets/svg/alive.svg";
import dead from "assets/svg/dead.svg";
import unknown from "assets/svg/unknown.svg"
import { Status } from "../data/character-model";

const StatusIcon: React.FC<{ status: Status | "alive" }> = ({
    status
}) => {
    const icon = useMemo(() => {
        switch (status) {
            case "Dead":
                return dead;
            case "Alive":
            case "alive":
                return alive;
            default:
                return unknown
        }
    }, [status]);
    return <img src={icon} alt={status} />
}

export default StatusIcon;