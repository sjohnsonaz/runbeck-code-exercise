import React from 'react';
import { IFile } from 'scripts/models/IFile';
import { Table } from '@artistry/react';

export interface ICSVListProps {
    files: IFile[];
}

export default class CSVList extends React.Component<ICSVListProps> {
    render() {
        return (
            <div>
                <Table
                    data={this.props.files}
                    columns={[{
                        property: "name",
                        header: "File"
                    }, {
                        property: "correct",
                        header: "Correct",
                        template: (file) => {
                            return (
                                <td key="correct">
                                    {file.correct ? 'correct' : 'incorrect'}
                                </td>
                            );
                        }
                    }, {
                        property: "incorrect",
                        header: "Incorrect"
                    }]}
                />
            </div>
        )
    }
}