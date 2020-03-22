import * as React from 'react';
import { Section, Form, FormGroup, FileUpload, FormText, Select, AmountInput, ActionBar, Button } from '@artistry/react';

export interface ICSVFormProps {

}

export default class CSVForm extends React.Component<ICSVFormProps> {
    render() {
        return (
            <Section
                header="CSV Upload"
                headerSpace
                footer={
                    <ActionBar>
                        <Button theme="primary"
                        >Upload</Button>
                    </ActionBar>
                }
            >
                <Form screenSize="medium">
                    <FormText>Where is the file located?</FormText>
                    <FormGroup label="File">
                        <FileUpload onUpload={() => { }} />
                    </FormGroup>
                    <FormText>Is the file format CSV (comma-separated values) or TSV (tab-separated values)?</FormText>
                    <FormGroup label="Format">
                        <Select data={[
                            'CSV (comma-separated values)',
                            'TSV (tab-separated values)'
                        ]}></Select>
                    </FormGroup>
                    <FormText>How many fields should each record contain?</FormText>
                    <FormGroup label="Fields">
                        <AmountInput></AmountInput>
                    </FormGroup>
                </Form>
            </Section>
        );
    }
}