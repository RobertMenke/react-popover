import React, { Component } from 'react';
import Popover from "./Popover"

class App extends Component {

    state = {
        top_left    : false,
        top_right   : false,
        bottom_left : false,
        bottom_right: false,
        top         : false,
        bottom      : false,
        left        : false,
        right       : false,
        center_left : false,
        center_right: false,
        elements : {
            top_left    : undefined,
            top_right   : undefined,
            bottom_left : undefined,
            bottom_right: undefined,
            top         : undefined,
            bottom      : undefined,
            left        : undefined,
            right       : undefined,
            center_left : undefined,
            center_right: undefined
        }
    }

  render() {
        const elements = this.state.elements
      const {
                top_left,
                top_right,
                bottom_left,
                bottom_right,
                top,
                bottom,
                left,
                right,
                center_right,
                center_left
            } = elements
    return (
        <div id = "wrapper" ref={c => this.container = c}>
            <div
                className = "hover top left"
                ref={c => this._top_left = c}
                 onMouseEnter={() => {
                    this.setState({
                        top_left : true
                    })
                }}
                 onMouseLeave={() => {
                     this.setState({
                         top_left : false
                     })
                 }}
            >
                <span>Autoplace Tooltip</span>
            </div>
            <div
                className = "hover top right"
                ref={c => this._top_right = c}
                 onMouseEnter={() => {
                    this.setState({
                        top_right : true
                    })
                }}
                 onMouseLeave={() => {
                     this.setState({
                         top_right : false
                     })
                 }}
            >
                <span>Autoplace Tooltip</span>
            </div>
            <div
                className = "hover bottom left"
                ref={c => this._bottom_left = c}
                 onMouseEnter={() => {
                    this.setState({
                        bottom_left : true
                    })
                }}
                 onMouseLeave={() => {
                     this.setState({
                         bottom_left : false
                     })
                 }}
            >
                <span>Autoplace Tooltip</span>
            </div>
            <div
                className = "hover bottom right"
                ref={c => this._bottom_right = c}
                 onMouseEnter={() => {
                    this.setState({
                        bottom_right : true
                    })
                }}
                 onMouseLeave={() => {
                     this.setState({
                         bottom_right : false
                     })
                 }}
            >
                <span>Autoplace Tooltip</span>
            </div>
            <div
                className = "hover top v-center js-below"
                ref={c => this._top = c}
                 onMouseEnter={() => {
                    this.setState({
                        top : true
                    })
                }}
                 onMouseLeave={() => {
                     this.setState({
                         top : false
                     })
                 }}
            >
                <span>Below Tooltip</span>
            </div>
            <div
                className = "hover bottom v-center js-above"
                ref={c => this._bottom = c}
                 onMouseEnter={() => {
                    this.setState({
                        bottom : true
                    })
                }}
                 onMouseLeave={() => {
                     this.setState({
                         bottom : false
                     })
                 }}
            >
                <span>Above Tooltip</span>
            </div>
            <div
                className = "hover left h-center js-right"
                ref={c => this._left = c}
                 onMouseEnter={() => {
                    this.setState({
                        left : true
                    })
                }}
                 onMouseLeave={() => {
                     this.setState({
                         left : false
                     })
                 }}
            >
                <span>Right Tooltip</span>
            </div>
            <div
                className = "hover right h-center js-left"
                ref={c => this._right = c}
                 onMouseEnter={() => {
                    this.setState({
                        right : true
                    })
                }}
                 onMouseLeave={() => {
                     this.setState({
                         right : false
                     })
                 }}
            >
                <span>Left Tooltip</span>
            </div>
            <div
                className = "hover center-right h-center js-alignright"
                ref={c => this._center_right = c}
                 onMouseEnter={() => {
                    this.setState({
                        center_right : true
                    })
                }}
                 onMouseLeave={() => {
                     this.setState({
                         center_right : false
                     })
                 }}
            >
                <span>Align-Right Tooltip</span>
            </div>
            <div
                className = "hover center-left h-center js-alignleft"
                ref={c => this._center_left = c}
                 onMouseEnter={() => {
                    this.setState({
                        center_left : true
                    })
                }}
                 onMouseLeave={() => {
                     this.setState({
                         center_left : false
                     })
                 }}
            >
                <span>Align-Left Tooltip</span>
            </div>

            <Popover
                parent={this.container}
                element={top_left}
                placement="auto"
                open={this.state.top_left}
                top_cushion={10}
                left_cushion={-50}
            >
                <span>I was called with placement="auto"</span>
            </Popover>
            <Popover
                parent={this.container}
                element={top_right}
                placement="auto"
                open={this.state.top_right}
                top_cushion={10}
                left_cushion={-50}
            >
                <span>I was called with placement="auto"</span>
            </Popover>
            <Popover
                parent={this.container}
                element={top}
                placement="bottom"
                open={this.state.top}
                top_cushion={10}
            >
                <span>I was called with placement="bottom"</span>
            </Popover>
            <Popover
                parent={this.container}
                element={bottom}
                placement="top"
                open={this.state.bottom}
                top_cushion={10}
            >
                <span>I was called with placement="top"</span>
            </Popover>
            <Popover
                parent={this.container}
                element={right}
                placement="left"
                open={this.state.right}
                left_cushion={10}
            >
                <span>I was called with placement="left"</span>
            </Popover>
            <Popover
                parent={this.container}
                element={left}
                placement="right"
                open={this.state.left}
                left_cushion={10}
            >
                <span>I was called with placement="right"</span>
            </Popover>
            <Popover
                parent={this.container}
                element={bottom_left}
                placement="auto"
                open={this.state.bottom_left}
                left_cushion={-50}
                top_cushion={10}
            >
                <span>I was called with placement="auto"</span>
            </Popover>
            <Popover
                parent={this.container}
                element={bottom_right}
                placement="auto"
                open={this.state.bottom_right}
                left_cushion={-50}
                top_cushion={10}
            >
                <span>I was called with placement="auto"</span>
            </Popover>
            <Popover
                parent={this.container}
                element={center_left}
                placement={["element_left", "bottom"]}
                open={this.state.center_left}
                top_cushion={10}
            >
                <span>I was called with placement="element_left"</span>
            </Popover>
            <Popover
                parent={this.container}
                element={center_right}
                placement={["element_right", "top"]}
                open={this.state.center_right}
                top_cushion={10}
            >
                <span>I was called with placement="element_right"</span>
            </Popover>
        </div>
    )
  }

  componentDidMount() {
        this.setState({
            elements: {
                top_left    : this._top_left,
                top_right   : this._top_right,
                bottom_right: this._bottom_right,
                bottom_left : this._bottom_left,
                top         : this._top,
                bottom      : this._bottom,
                left        : this._left,
                right       : this._right,
                center_right: this._center_right,
                center_left : this._center_left
            }
        })
  }
}

export default App;
