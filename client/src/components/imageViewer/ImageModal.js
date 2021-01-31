import ImageViewer from "./imageViewer";
import React, {Component} from "react";
import './style.css';
import PropTypes from "prop-types";

class ImageModal extends Component {

    static propTypes = {
        images: PropTypes.array,
        prefixCls: PropTypes.string,
        className: PropTypes.string,
        // Bottom indicators preview
        showPreview: PropTypes.bool,
        // Toolbar index indicator
        showIndex: PropTypes.bool,
    }

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            activeIndex: undefined
        }
    }

    open(activeIndex) {
        this.setState({
            visible: true,
            activeIndex: activeIndex || 0
        });
    }

    close() {
        this.setState({
            visible: false,
            activeIndex: undefined
        })
    }

    render() {
        const {
            images,
            prefixCls,
            className,
            showIndex,
            showPreview
        } = this.props;
        const { activeIndex } = this.state;

        return this.state.visible ? (
            <div className='modal'>
                <ImageViewer
                    showPreview={showPreview}
                    showIndex={showIndex}
                    prefixCls={prefixCls}
                    activeIndex={activeIndex}
                    images={images}/>
                <div className='close-button'
                     onClick={this.close.bind(this)}>
                </div>
            </div>
        ) : null;
    }
}



export default ImageModal;