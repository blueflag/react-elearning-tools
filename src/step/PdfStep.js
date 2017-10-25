import React from 'react';
import {Document} from 'react-pdf/build/entry.webpack';
import {Page} from 'react-pdf';

export default class PdfStep extends React.Component {
    state = {
        numPages: null,
        loaded: false
    }

    onDocumentLoad = ({numPages}) => {
        this.setState({numPages, loaded: true});
    }
    render() {
        const {pageNumber, numPages, loaded} = this.state;
        const {file, actions} = this.props;

        return <div>
            <Document
              file={file}
              onLoadSuccess={this.onDocumentLoad}
            >
                {Array.from(
                  new Array(numPages),
                  (el, index) => (
                    <Page
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                      onRenderSuccess={this.onPageRenderSuccess}
                      width={Math.min(600, document.body.clientWidth - 52)}
                    />
                  ),
                )}
            </Document>
            {loaded && <button onClick={actions.onNext}>I have read this pdf</button>}
        </div>;
    }
}
