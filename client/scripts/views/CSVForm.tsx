import React from 'react';
import { Section, Form, FormGroup, FileUpload, FormText, Select, AmountInput, ActionBar, Button, Modal } from '@artistry/react';
import { FileFormat } from 'scripts/models/FileFormat';

export interface ICSVFormProps {
    onUpload: () => any;
}

export interface ICSVFormState {
    open?: boolean;
    file?: File;
    format?: FileFormat;
    fields?: number;
}

export default class CSVForm extends React.Component<ICSVFormProps, ICSVFormState> {
    state: ICSVFormState = {
        open: false,
        format: FileFormat.CommaSeparated,
        fields: 1
    }

    onOpen = () => {
        this.setState({
            open: true
        });
    }

    onSelect = (files: FileList) => {
        this.setState({
            file: files[0]
        });
    }

    changeFormat = (option: {
        title: string;
        value: FileFormat;
    }) => {
        this.setState({
            format: option.value
        });
    }

    changeFields = (fields: number) => {
        this.setState({
            fields: fields
        });
    }

    reset() {
        this.setState({
            open: false,
            fields: 1,
            file: undefined,
            format: FileFormat.CommaSeparated
        });
    }

    confirm = async () => {
        if (this.state.file) {
            await this.uploadFile(this.state.file);
            this.reset();
            this.props.onUpload();
        }
    }

    cancel = async () => {
        this.reset();
    }

    async uploadFile(file: File, progressHandler?: (event: ProgressEvent) => void): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(xhr.responseText)
                    } else {
                        reject(xhr.responseText);
                    }
                }
            };
            xhr.onprogress = (event) => {
                if (progressHandler) {
                    progressHandler(event);
                }
            };
            xhr.open('POST', 'http://localhost:3001/file/upload', true);
            let formData = new FormData();
            formData.append('format', this.state.format);
            formData.append('fields', this.state.fields.toString());
            formData.append('file', file);
            xhr.send(formData);
        });
    }

    render() {
        let valid = this.state.format && (this.state.fields > 0) && this.state.file
        return (
            <>
                <ActionBar>
                    <Button
                        onClick={this.onOpen}
                        theme="primary"
                    >Upload</Button>
                </ActionBar>
                <Modal
                    open={this.state.open}
                    onClose={this.cancel}
                    onConfirm={this.confirm}
                    title="CSV Upload"
                    screenSize="medium"
                    footer={
                        <ActionBar>
                            <Button
                                onClick={this.cancel}
                            >Cancel</Button>
                            <Button
                                onClick={this.confirm}
                                theme="primary"
                                disabled={!valid}
                            >Upload</Button>
                        </ActionBar>
                    }
                >
                    <Form screenSize="medium">
                        <FormText>
                            Where is the file located?
                        </FormText>
                        <FormGroup label="File" text={this.state.file && this.state.file.name ?
                            this.state.file.name :
                            undefined}>
                            <FileUpload onUpload={this.onSelect} />
                        </FormGroup>
                        <FormText>
                            Is the file format CSV (comma-separated values) or TSV (tab-separated values)?
                        </FormText>
                        <FormGroup label="Format">
                            <Select
                                data={[{
                                    title: 'CSV (comma-separated values)',
                                    value: FileFormat.CommaSeparated
                                }, {
                                    title: 'TSV (tab-separated values)',
                                    value: FileFormat.TabSeparated
                                }]}
                                valueProp="value"
                                displayProp="title"
                                onChange={this.changeFormat}
                                value={this.state.format}
                            />
                        </FormGroup>
                        <FormText>
                            How many fields should each record contain?
                    </FormText>
                        <FormGroup label="Fields">
                            <AmountInput
                                value={this.state.fields}
                                onChange={this.changeFields}
                                minimum={1}
                            />
                        </FormGroup>
                    </Form>
                </Modal>
            </>
        );
    }
}