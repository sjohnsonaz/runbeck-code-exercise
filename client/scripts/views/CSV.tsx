import React from 'react';

import { IFile } from '../models/IFile';
import CrudConnection from '../base/CrudConnection';

import CSVForm from './CSVForm';
import CSVList from './CSVList';

export interface ICSVProps {

}

export interface ICSVState {
    files: IFile[];
}

export default class CSV extends React.Component<ICSVProps, ICSVState> {
    state: ICSVState = {
        files: []
    }
    connection = new CrudConnection<IFile>('file');

    async componentDidMount() {
        await this.refreshData();
    }

    async refreshData() {
        let list = await this.connection.list({});
        this.setState({
            files: list.data
        });
    }

    onUpload = async () => {
        await this.refreshData();
    }

    onDelete = async (file: IFile) => {
        await this.connection.delete(file._id);
        await this.refreshData();
    }

    render() {
        return (
            <div>
                <CSVForm
                    onUpload={this.onUpload}
                />
                <CSVList
                    files={this.state.files}
                    onDelete={this.onDelete}
                />
            </div>
        );
    }
}