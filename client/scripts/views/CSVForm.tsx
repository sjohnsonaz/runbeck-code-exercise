import * as React from 'react';
import { Section, Form, FormGroup, FileUpload, FormText, Select, AmountInput, ActionBar, Button } from '@artistry/react';

export interface ICSVFormProps {

}

export interface ICSVFormState {
    files?: FileList;
}

export default class CSVForm extends React.Component<ICSVFormProps, ICSVFormState> {
    state: ICSVFormState = {
        files: [] as any
    }

    onUpload = (files: FileList) => {
        this.setState({
            files: files
        });
    }

    confirm = () => {
        this.uploadFile(this.state.files[0]);
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
            formData.append('format', 'CommaSeparated');
            formData.append('fieldCount', '3');
            formData.append('file', file);
            xhr.send(formData);
        });
    }

    render() {
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
                        <Select data={[
                            'CSV (comma-separated values)',
                            'TSV (tab-separated values)'
                        ]}></Select>
                    </FormGroup>
                    <FormText>
                        How many fields should each record contain?
                    </FormText>
                    <FormGroup label="Fields">
                        <AmountInput></AmountInput>
                    </FormGroup>
                </Form>
            </Section>
        );
    }
}