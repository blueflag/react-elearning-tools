import React from 'react';
import {Document} from 'react-pdf/build/entry.webpack';
import {Page} from 'react-pdf';
import {Button, Box} from 'obtuse';

export default class PdfStep extends React.Component {
    state = {
        numPages: null,
        loaded: false
    }

    onDocumentLoad = ({numPages}) => {
        this.setState({numPages, loaded: true});
    }
    onClick = () => {
        const {actions} = this.props;
        actions.onProgress(100);
        actions.onNext();
    }
    render() {
        const {pageNumber, numPages, loaded} = this.state;
        const {file, actions} = this.props;

        const nextButton = <Box modifier="marginMega">
            <Button modifier="sizeMega primary" onClick={this.onClick}>I have read this pdf</Button>
        </Box>;

        return <div className="Document">
            <Document
              file={file}
              onLoadSuccess={this.onDocumentLoad}
            >
                {Array.from(
                  new Array(numPages),
                  (el, index) => (
                    <Page
                        className="Document_page"
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        onRenderSuccess={this.onPageRenderSuccess}
                        width={Math.min(600, document.body.clientWidth - 52)}
                    />
                  ),
                )}
            </Document>
            {loaded && nextButton}
        </div>;
    }
}
