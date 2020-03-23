import React from 'react';
import { IFile } from 'scripts/models/IFile';
import { Button } from '@artistry/react';
export interface IDeleteButtonProps {
    file: IFile;
    onDelete: (file: IFile) => Promise<any>;
}

export interface IDeleteButtonState {
    deleting?: boolean;
}

export default class DeleteButton extends React.Component<IDeleteButtonProps, IDeleteButtonState> {
    state: IDeleteButtonState = {
        deleting: false
    }

    onDelete = async () => {
        try {
            this.setState({
                deleting: true
            });
            await this.props.onDelete(this.props.file);
        }
        catch {

        }
        finally {
            this.setState({
                deleting: false
            })
        }
    }

    render() {
        return (
            <Button
                onClick={this.onDelete}
                theme="danger"
                lockContent="..."
                locked={this.state.deleting}
            >Delete</Button>
        );
    }
}