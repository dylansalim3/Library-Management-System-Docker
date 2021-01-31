import PropTypes from 'prop-types';
import './style.css';
import React, {Component} from 'react';
import axios from "axios";

const constants_1 = require("./constants");


class ImageWrapper extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: false,
            onload: false,
            zoom: 0,
            rotate: 0,
            offset: constants_1.OFFSET_DEFAULT
        };
        this.draggable = false;
        this.offsetRange = constants_1.OFFSET_DEFAULT;
        this.clientOffset = {
            x: undefined,
            y: undefined
        };
    }

    loadImage(src) {
        this.state.loading = true;
        this.setState(this.state);
        this.src = new Image();
        this.src.src = src;
        this.src.onload = () => {
            if (!this.src)
                return;
            this.state.loading = false;
            this.state.onload = true;
            this.setState(this.state);
        };
        this.src.onerror = () => {
            if (!this.src)
                return;
            this.state.loading = false;
            this.state.onload = false;
            this.setState(this.state);
        };
    }

    resetOffset() {
        this.state.offset = constants_1.OFFSET_DEFAULT;
        this.setState(this.state);
    }

    setOffsetRange() {
        const zoom = this.state.zoom;
        const dx = this.image?.scrollWidth * (1 + zoom / 2) - this.imageOuter?.clientWidth;
        const dy = this.image?.scrollHeight * (1 + zoom / 2) - this.imageOuter?.clientHeight;
        this.offsetRange = {
            x: Math.max(0, dx / 2),
            y: Math.max(0, dy / 2)
        };
    }

    zoomIn() {
        if (!this.state.onload)
            return;
        this.state.zoom = Math.min(this.state.zoom + 1, constants_1.ZOOM_LEVEL.MAX);
        this.setState(this.state);
        this.setOffsetRange();
    }

    rotate() {
        if (!this.state.onload)
            return;
        var rotation = this.state.rotate;
        this.state.rotate = rotation + 90;
        this.setState(this.state);
        this.setOffsetRange();
    }

    zoomOut() {
        if (!this.state.onload)
            return;
        this.state.zoom = Math.max(0, this.state.zoom - 1);
        this.setState(this.state);
        this.resetOffset();
        this.setOffsetRange();
    }

    onMoveStart(e) {
        if (!this.offsetRange.x && !this.offsetRange.y) {
            return;
        }
        this.clientOffset = {
            x: e.clientX,
            y: e.clientY
        };
        this.draggable = true;
    }

    onMove(e) {
        if (!e.clientX && !e.clientY || !this.draggable) {
            return;
        }
        const offset = {
            x: e.clientX - this.clientOffset.x,
            y: e.clientY - this.clientOffset.y,
        };
        this.clientOffset = {
            x: e.clientX,
            y: e.clientY
        };
        this.state.offset = {
            x: this.state.offset.x + offset.x,
            y: this.state.offset.y + offset.y,
        };
        this.setState(this.state);
    }

    onMoveEnd(e) {
        if (!this.mounted)
            return;
        this.draggable = false;
        const offset = {
            x: Math.abs(this.state.offset.x),
            y: Math.abs(this.state.offset.y)
        };
        if (Math.abs(this.state.offset.x) >= this.offsetRange.x) {
            this.state.offset.x = this.state.offset.x < 0 ? Math.min(0, -(this.offsetRange.x)) : Math.max(0, this.offsetRange.x);
            this.setState(this.state);
        }
        if (Math.abs(this.state.offset.y) >= this.offsetRange.y) {
            this.state.offset.y = this.state.offset.y < 0 ? Math.min(0, -(this.offsetRange.y)) : Math.max(0, this.offsetRange.y);
            this.setState(this.state);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.image.src != nextProps.image.src && this.props.image != null) {
            this.resetOffset();
            this.loadImage(nextProps.image.src);
            this.setState({
                zoom: 0
            });
        }
    }

    componentDidMount() {
        this.mounted = true;
        this.loadImage(this.props.image.src);
        window.addEventListener('resize', this.setOffsetRange.bind(this));
        document.documentElement.addEventListener("mouseup", this.onMoveEnd.bind(this));
    }

    componentWillUnmount() {
        this.mounted = false;
        if (!!this.src) {
            this.src = undefined;
        }
        window.removeEventListener('resize', this.setOffsetRange.bind(this));
        document.documentElement.removeEventListener("mouseup", this.onMoveEnd.bind(this));
    }

    render() {
        const {image, index, showIndex} = this.props;
        const {offset, zoom, loading, rotate} = this.state;
        // const value = `translate3d(${offset.x}px, ${offset.y}px, 0px)`;
        const value = `rotate(${rotate}deg)`;
        const imageCls = `zoom-${zoom} image-outer ${this.draggable ? 'dragging' : ''}`;
        const caption = (<p className="caption">
                {image.title ? <span className="title">{image.title}</span> : null}
                {image.title && image.content ? <span>{` - `}</span> : null}
                {image.title ? <span className="content">{image.content}</span> : null}
            </p>
        );

        return (<div className="image-wrapper">
            <div
                style={{transform: value}}
                ref={(component) => this.imageOuter = component}
                className={imageCls}>
                {loading ? (
                    <div className="spinner">
                        <div className="bounce"></div>
                    </div>
                ) : <img
                    className="image"
                    ref={(component) => this.image = component}
                    src={image.src}
                    alt={image.title || ''}
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                    onMouseMove={this.onMove.bind(this)}
                    onMouseDown={this.onMoveStart.bind(this)}
                    onMouseUp={this.onMoveEnd.bind(this)}/>}
            </div>
            <div className="tool-bar">
                {showIndex && <div className="index-indicator">{index}</div>}
                {caption}
                <div className="button-group">
                    <div className="zoom-out button"
                         onClick={this.zoomOut.bind(this)}>
                    </div>
                    <div className="zoom-in button"
                         onClick={this.zoomIn.bind(this)}>
                    </div>
                </div>
            </div>
        </div>);

    }
}

class ImageViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: this.props.activeIndex,
        };
    }

    renderIndicators(list) {
        const activeIndex = this.state.activeIndex;
        const ret = Math.round(constants_1.VISIBLE_INDICATORS_COUNT / 2);
        const length = list.length;
        return list.map((item, index) => {
            const isActive = activeIndex === index;
            const itemInvisible = length > constants_1.VISIBLE_INDICATORS_COUNT && (index < Math.min(length - constants_1.VISIBLE_INDICATORS_COUNT - 1, activeIndex - ret) || index > Math.max(activeIndex + ret, constants_1.VISIBLE_INDICATORS_COUNT));
            const itemCls = `indicators-item ${isActive ? 'active' : ''} ${itemInvisible ? 'invisible' : ''} ${this.props.showPreview ? 'preview' : ''}`;
            
            return (
                <div
                    key={index}
                    className={itemCls}
                    onClick={this.itemControl.bind(this, index)}>
                    {this.props.showPreview && (
                        <div className="image"
                             style={{backgroundImage: `url(${axios.defaults.baseURL}/${item.src})`}}></div>
                    )}
                </div>
            );
        });
    }

    onPrev() {
        let index = (this.state.activeIndex + this.props.images.length - 1) % this.props.images.length;
        this.itemControl(index);
    }

    onNext() {
        let index = (this.state.activeIndex + 1) % this.props.images.length;
        this.itemControl(index);
    }

    itemControl(index) {
        if (index === this.state.activeIndex)
            return;
        this.state.activeIndex = index;
        this.setState(this.state);
    }

    onKeyDown(e) {
        if (!this.mounted)
            return;
        e.stopPropagation();
        switch (e.which || e.keyCode) {
            case constants_1.KEY_CODE.LEFT:
                this.onPrev();
                break;
            case constants_1.KEY_CODE.RIGTH:
                this.onNext();
                break;
        }
    }

    componentDidMount() {
        this.mounted = true;
        document.documentElement.addEventListener("keydown", this.onKeyDown.bind(this));
    }

    componentWillUnmount() {
        this.mounted = false;
        document.documentElement.removeEventListener("keydown", this.onKeyDown.bind(this));
    }

    render() {
        const {images, showIndex, prefixCls} = this.props;
        const {activeIndex} = this.state;
        const indicatorVisible = images.length > 1;
        return (
            <div className={`react-image-viewer ${prefixCls}-image-viewer`}
                 ref={(component) => this.container = component}>
                <ImageWrapper
                    showIndex={showIndex}
                    index={`${activeIndex + 1}/${images.length}`}
                    image={images[activeIndex]}/>
                {indicatorVisible ?
                    <div className="direction-control-button">
                        <div className="prev-button button"
                             onClick={this.onPrev.bind(this)}>
                            <div className="bar"></div>
                        </div>
                        <div className="next-button button"
                             onClick={this.onNext.bind(this)}>
                            <div className="bar"></div>
                        </div>
                        <div className="indicators">
                            {indicatorVisible && this.renderIndicators(images)}
                        </div>
                    </div>
                    : null}
            </div>
        )
    }
}

ImageViewer.defaultProps = {
    prefixCls: 'react-image-viewer',
    className: 'reactInsurance-image-viewer',
    showIndex: true,
    showPreview: true,
    activeIndex: 0,
};
ImageViewer.propTypes = {
    prefixCls: PropTypes.string,
    className: PropTypes.string,
    showIndex: PropTypes.bool,
    showPreview: PropTypes.bool,
    activeIndex: PropTypes.number,
};
export default ImageViewer;
