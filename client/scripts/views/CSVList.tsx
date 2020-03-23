import React from 'react';
import { IFile } from 'scripts/models/IFile';
import { Table, Button, Divider, Scrollable } from '@artistry/react';
import { FileFormat } from 'scripts/models/FileFormat';
import DeleteButton from './DeleteButton';

export interface ICSVListProps {
    files: IFile[];
    onDelete: (file: IFile) => Promise<any>;
}

export default class CSVList extends React.Component<ICSVListProps> {
    onDelete(file: IFile) {
        return this.props.onDelete(file);
    }

    render() {
        return (
            <Scrollable type="x">
                {this.props.files && this.props.files.length ?
                    <Table
                        hoverable
                        striped
                        data={this.props.files}
                        columns={[{
                            property: "name",
                            header: "File",
                            template: (file) => {
                                return (
                                    <td key="file">
                                        <a
                                            href={'upload/' + file._id + '.txt'}
                                            target="_blank"
                                        >{file.name}</a>
                                    </td>
                                );
                            }
                        }, {
                            property: "format",
                            header: "Format",
                            template: (file) => {
                                let format: string;
                                switch (file.format) {
                                    case FileFormat.CommaSeparated:
                                        format = 'CSV';
                                        break;
                                    case FileFormat.TabSeparated:
                                        format = 'TSV';
                                        break;
                                }
                                return (
                                    <td key="format">
                                        {format}
                                    </td>
                                );
                            }
                        }, {
                            property: "fields",
                            header: "Fields"
                        }, {
                            property: "correct",
                            header: "Correct",
                            template: (file) => {
                                return (
                                    <td key="correct">
                                        {file.correct ?
                                            <a
                                                href={'upload/' + file._id + '_correct.txt'}
                                                target="_blank"
                                            >Download</a> :
                                            undefined}
                                    </td>
                                );
                            }
                        }, {
                            property: "incorrect",
                            header: "Incorrect",
                            template: (file) => {
                                return (
                                    <td key="incorrect">
                                        {file.incorrect ?
                                            <a
                                                href={'upload/' + file._id + '_incorrect.txt'}
                                                target="_blank"
                                            >Download</a> :
                                            undefined}
                                    </td>
                                );
                            }
                        }, {
                            action: true,
                            template: (file) => {
                                return (
                                    <td key="action">
                                        <DeleteButton
                                            key={file._id}
                                            file={file}
                                            onDelete={this.onDelete.bind(this, file)}
                                        />
                                    </td>
                                );
                            }
                        }]}
                    /> :
                    <>
                        <Divider />
                        <div className="align-center space ">No files</div>
                    </>}
            </Scrollable>
        )
    }
}