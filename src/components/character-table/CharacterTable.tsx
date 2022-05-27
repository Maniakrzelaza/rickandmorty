import React, {useCallback, useMemo} from "react";
import { Character } from "rickmortyapi/dist/interfaces";
import { Select, Table, Tooltip } from "antd";
import { ColumnsType } from "antd/lib/table";
import { Status } from "../../data/character-model";
import classNames from "classnames";
import locationService from "../../data/location-service";
import episodeService from "../../data/episode-service";
import { CaretDownOutlined } from "@ant-design/icons";
import StatusIcon from "../StatusIcon";
import random from "random-seed";
import overrideDataService from "../../data/override-data-service";

const columns = (
    isLargeUp: boolean,
    isEditing: boolean,
    editableRows: React.Key[],
    onEditSuccess: (ch: Character) => (status: Status) => void,
) => [
    {
        title: () => (
            <div className="table__header-font">
                Name
            </div>
        ),
        width: isLargeUp ? 250 : undefined,
        dataIndex: "name",
        ellipsis: {
            showTitle: false,
        },
        key: "name",
        sorter: (a, b) => a.name.localeCompare(b.name),
        render: (data: string, character: Character) => {
            const cellContent = (inTooltip = false) => (
                <>
                    <div className={classNames("table__primary-font", {
                        "dead": character.status === "Dead",
                        "text-truncate": !inTooltip,
                    })}>
                        {data}
                    </div>
                    <div className={classNames("table__secondary-font", {
                        "dead": character.status === "Dead",
                        "text-truncate": !inTooltip,
                    })}>
                        {character.species}
                    </div>
                </>
            )
            const tooltipContent = (
                <div className="flex flex-column">
                    <div className="app-content__cell-tooltip__header">
                        Name
                    </div>
                    <div className="d-flex flex-column app-content__cell-tooltip__body">
                        {cellContent(true)}
                    </div>
                </div>
            )
            return (
                <Tooltip overlayClassName="app-content__cell-tooltip" placement="rightTop" title={tooltipContent}>
                    <div className="d-flex flex-column">
                        {cellContent()}
                    </div>
                </Tooltip>

            )
        }
    },
    {
        title: () => (
            <div className="table__header-font">
                Avatar
            </div>
        ),
        width: isLargeUp ? 200 : undefined,
        key: "image",
        dataIndex: "image",
        render: (data: string) => {
            return (
                <img className="app-content__avatar" width={50} height={50} src={data} alt={data} />
            )
        }
    },
    {
        title: () => (
            <div className="table__header-font">
                Origin
            </div>
        ),
        sorter: (a, b) => a.origin.name.localeCompare(b.origin.name),
        width: isLargeUp ? 200 : undefined,
        key: "origin",
        ellipsis: true,
        dataIndex: "origin",
        render: (data: { name: string, url: string }, character: Character) => {

            const cellContent = (inTooltip = false) => <>
                <div className={classNames({
                    "table__primary-font--light": data.name !== "unknown",
                    "dead": character.status === "Dead",
                    "table__unknown-origin": data.name === "unknown",
                    "text-truncate": !inTooltip,
                })}>
                    {data.name}
                </div>
                <div className={classNames("table__secondary-font", {
                    "dead": character.status === "Dead",
                    "text-truncate": !inTooltip,
                })}>
                    {locationService.getType(data.url)}
                </div>
            </>

            const tooltipContent = (
                <div className="flex flex-column">
                    <div className="app-content__cell-tooltip__header">
                        Location
                    </div>
                    <div className="d-flex flex-column app-content__cell-tooltip__body">
                        {cellContent(true)}
                    </div>
                </div>
            )
            return (
                <Tooltip overlayClassName="app-content__cell-tooltip" placement="leftTop" title={tooltipContent}>
                    <div className="d-flex flex-column">
                        {cellContent()}
                    </div>
                </Tooltip>
            )
        }
    },
    {
        title: () => (
            <div className="table__header-font">
                Episodes
            </div>
        ),
        width: isLargeUp ? 200 : undefined,
        ellipsis: true,
        key: "episode",
        dataIndex: "episode",
        sorter: (a, b) => a.episode[0].localeCompare(b.episode[0]),
        render: (data: string[], character: Character) => {
            const rand = random.create(character.id)
            const [index1, index2] = [rand(data.length), rand(data.length)];

            const cellContent = (inTooltip = false) => data.length === 1 ? (
                <div className={classNames("table__primary-font--light", {
                    "text-truncate": !inTooltip,
                    "dead": character.status === "Dead",
                })}>
                    {episodeService.getName(data[0])}
                </div>
            ) : (
                <div className="d-flex flex-column">
                    <div className={classNames("table__primary-font--light", {
                        "text-truncate": !inTooltip,
                        "dead": character.status === "Dead",
                    })}>
                        {episodeService.getName(data[index1])}
                    </div>
                    <div className={classNames("table__primary-font--light", {
                        "text-truncate": !inTooltip,
                        "dead": character.status === "Dead",
                    })}>
                        {episodeService.getName(data[index2])}
                    </div>
                </div>
            )
            const tooltipContent = <div className="flex flex-column">
                <div className="app-content__cell-tooltip__header">
                    Episodes
                </div>
                <div className="d-flex flex-column app-content__cell-tooltip__body">
                    {cellContent(true)}
                </div>
            </div>
            return (
                <Tooltip overlayClassName="app-content__cell-tooltip" placement="leftTop" title={tooltipContent}>
                    <div className="d-flex flex-column">
                        {cellContent()}
                    </div>
                </Tooltip>
            )
        }
    },
    {
        title: () => (
            <div className="table__header-font">
                Status
            </div>
        ),
        ellipsis: true,
        width: isLargeUp ? 180 : undefined,
        key: "status",
        dataIndex: "status",
        sorter: (a, b) => a.status.localeCompare(b.status),
        render: (status: Status, character: Character) => {
            if (isEditing && editableRows.includes(character.id)) {
                return (
                    <Select
                        allowClear
                        className="inputs__edit-status-select"
                        placeholder="Status"
                        showArrow={true}
                        suffixIcon={<CaretDownOutlined className="app-content__select-caret" />}
                        onChange={onEditSuccess(character)}
                    >
                        <Select.Option key="Dead">Dead</Select.Option>
                        <Select.Option key="unknown">Unknown</Select.Option>
                        <Select.Option key="alive">Alive</Select.Option>
                    </Select>
                )
            }
            return (
                <div className="d-flex flex-row">
                    <StatusIcon status={status} />
                    <div className={classNames("table__status", {
                        "table__header-font": status !== "unknown",
                        "table__unknown-status": status === "unknown"
                    })}>
                        {status}
                    </div>
                </div>
            )
        }
    },
];

type ICharacterTableProps = {
    filteredCharacters: Character[],
    loading: boolean,
    setSelectedCharacters: (keys: React.Key[]) => void,
    toggleEditable: () => void,
    isEditing,
    isLargeUp,
    selectedCharacters,
}

const CharacterTable: React.FC<ICharacterTableProps> = ({
    filteredCharacters,
    loading,
    setSelectedCharacters,
    toggleEditable,
    isEditing,
    isLargeUp,
    selectedCharacters,
}) => {
    const characterCount = useMemo(() => filteredCharacters.length, [filteredCharacters]);

    const rowSelection = useMemo(() => ({
        selectedRowKeys: selectedCharacters,
        onChange: (selectedRowKeys: React.Key[]) => {
            setSelectedCharacters(selectedRowKeys);
        },
    }), [selectedCharacters, setSelectedCharacters]);

    const onEditSuccess = useCallback((ch: Character) => (newStatus: Status) => {
        if (newStatus !== ch.status) {
            overrideDataService.update({ [ch.id]: { status: newStatus } });
        }
        toggleEditable();
        setSelectedCharacters([]);
        rowSelection.onChange([])
    }, [toggleEditable, setSelectedCharacters, rowSelection]);

    const columnsDefinitions: ColumnsType<Character> = useMemo(
        () => columns(isLargeUp, isEditing, selectedCharacters, onEditSuccess),
        [isEditing, isLargeUp, selectedCharacters, onEditSuccess]
    );

    const config = useMemo(() => ({
        bordered: false,
        loading: loading,
        title: undefined,
        showHeader: true,
        rowSelection: {},
        hasData: characterCount > 0,
    }), [characterCount, loading]);

    return (
        <Table
            {...config}
            rowSelection={rowSelection}
            loading={loading}
            columns={columnsDefinitions}
            dataSource={filteredCharacters}
            pagination={{ defaultPageSize: 5, showLessItems: true, showSizeChanger: false }}
            // scroll={{ x: "300px" }}
            // tableLayout="fixed"
            rowClassName={(record: Character) => {
                return record.status === "Dead" ? "table__dead-row" : "";
            }}
        />
    )
}

export default CharacterTable;