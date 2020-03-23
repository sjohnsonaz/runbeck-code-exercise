import * as React from 'react';
import { Section, Form, FormGroup, FileUpload, FormText, Select, AmountInput, ActionBar, Button } from '@artistry/react';

export enum FileFormat {
    CommaSeparated = 'CommaSeparated',
    TabSeparated = 'TabSeparated'
}

export interface ICSVFormProps {

}

export interface ICSVFormState {
    file?: File;
    format?: FileFormat;
    fields?: number;
}

export default class CSVForm extends React.Component<ICSVFormProps, ICSVFormState> {
    state: ICSVFormState = {
        format: FileFormat.CommaSeparated,
        fields: 1
    }

    onUpload = (files: FileList) => {
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

    confirm = () => {
        if (this.state.file) {
            this.uploadFile(this.state.file);
        }
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
            xhr.open('POST', 'http://localhost:3001/file', true);
            //xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
            //xhr.setRequestHeader("Content-Type", "multipart/form-data");
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
            <Section
                header="CSV Upload"
                headerSpace
                footer={
                    <ActionBar>
                        <Button
                            onClick={this.confirm}
                            theme="primary"
                        >Upload</Button>
                    </ActionBar>
                }
            >
                <Form screenSize="medium">
                    <FormText>
                        Where is the file located?
                    </FormText>
                    <FormGroup label="File">
                        <FileUpload onUpload={this.onUpload} />
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
            </Section>
        );
    }
}