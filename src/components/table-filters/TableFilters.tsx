import React from "react";
import { Button, Input, Select } from "antd";
import { CaretDownOutlined, SearchOutlined } from "@ant-design/icons";
import { Species, SpeciesValues, Status } from "../../data/character-model";
import locationService from "../../data/location-service";
import classNames from "classnames";
import edit from "assets/svg/edit.svg"
import trash from "assets/svg/trash.svg"

type ITableFiltersProps = {
    numberOfSelectedCharacters: number,
    onFilterTextChange: (e) => void,
    onFilterSpeciesChange: (species: Species[]) => void,
    onFilterOriginsChange: (origins: string[]) => void ,
    onFilterStatusChange: (status: Status) => void,
    toggleEditable: () => void,
    removeCharacters: () => void,
}

const TableFilters: React.FC<ITableFiltersProps> = ({
    numberOfSelectedCharacters,
    onFilterSpeciesChange,
    onFilterTextChange,
    onFilterOriginsChange,
    onFilterStatusChange,
    toggleEditable,
    removeCharacters,
}) => {
    return (
        <div className="filters">
            <div className="d-flex flex-row">
                <Input
                    placeholder="Search"
                    className="filters__search"
                    onChange={onFilterTextChange}
                    suffix={<SearchOutlined className="filters__search-icon" />}
                />
                <Select
                    mode="multiple"
                    allowClear
                    className="inputs__select"
                    placeholder="Species"
                    showArrow={true}
                    suffixIcon={<CaretDownOutlined className="inputs__select-caret" />}
                    onChange={onFilterSpeciesChange}
                >
                    {SpeciesValues.map((value, i) => (
                        <Select.Option key={value}>{value}</Select.Option>
                    ))}
                </Select>
                <Select
                    mode="multiple"
                    allowClear
                    className="inputs__select"
                    placeholder="Origin"
                    showArrow={true}
                    suffixIcon={<CaretDownOutlined className="inputs__select-caret" />}
                    onChange={onFilterOriginsChange}
                >
                    {locationService.locationOptions.map((value, i) => (
                        <Select.Option key={value}>{value}</Select.Option>
                    ))}
                </Select>
                <Select
                    allowClear
                    className="inputs__select"
                    placeholder="Status"
                    showArrow={true}
                    suffixIcon={<CaretDownOutlined className="inputs__select-caret" />}
                    onChange={onFilterStatusChange}
                >
                    <Select.Option key="Dead">Dead</Select.Option>
                    <Select.Option key="unknown">Unknown</Select.Option>
                    <Select.Option key="alive">Alive</Select.Option>
                </Select>
            </div>
            <div className="d-flex flex-row">
                <Button
                    type="primary"
                    className={classNames("inputs__change-status-btn", {
                        "hidden": numberOfSelectedCharacters > 1,
                    })}
                    icon={<img className="inputs__btn__icon" src={edit} alt={"edit"} />}
                    disabled={numberOfSelectedCharacters !== 1}
                    onClick={toggleEditable}
                >
                    Change status
                </Button>
                <Button
                    type="primary"
                    className="inputs__remove-btn"
                    disabled={numberOfSelectedCharacters === 0}
                    icon={<img className="inputs__btn__icon" src={trash} alt={"remove"} />}
                    onClick={removeCharacters}
                >
                    Remove characters
                </Button>
            </div>
        </div>
    )
}

export default TableFilters;