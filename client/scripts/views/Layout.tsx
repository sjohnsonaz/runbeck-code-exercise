import * as React from 'react';
import { MenuBar, Container } from '@artistry/react';
import CSVForm from './CSVForm';

export interface ILayoutProps {

}

export default class Layout extends React.Component<ILayoutProps> {
    render() {
        return (
            <div>
                <MenuBar title="Runbeck Code Exercise"></MenuBar>
                <Container menuBarTop screenSize="medium">
                    <CSVForm />
                </Container>
            </div>
        );
    }
}