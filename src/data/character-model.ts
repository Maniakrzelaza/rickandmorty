export type Status = "Dead" | "Alive" | "unknown";

export type IOverrideData = { [id: number]: { removed?: boolean, status?: Status } };

export type Species = "Human"
    | "Humanoid"
    | "Poopybutthole"
    | "Alien"
    | "unknown"
    | "Mythological Creature"
    | "Animal"
    | "Robot"
    | "Cronenberg"
    | "Disease";

export const SpeciesValues = ["Human",
    "Humanoid",
    "Poopybutthole",
    "Alien",
    "unknown",
    "Mythological Creature",
    "Animal",
    "Robot",
    "Cronenberg",
    "Disease",
];