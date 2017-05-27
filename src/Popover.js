// @flow
import React, { Component } from "react"
import ReactDOM from "react-dom"

type Props = {
    element : HTMLElement,
    parent : HTMLElement,
    placement : string | Array<string>,
    open : boolean,
    classes : string | Array<string> | null,
    left_cushion : ?number,
    top_cushion : ?number,
    children : Array<Element>
}

type Coordinate = {
    top : number,
    left : number
}

export default class Popover extends Component {

    state : Object

    constructor ( props : Props ) {
        super( props )
        this.state = {
            element     : props.element,
            parent      : props.parent,
            tooltip     : null,
            element_rect: null,
            parent_rect : null,
            tooltip_rect: null,
            placement   : props.placement,
            open        : props.open,
            classes     : "",
            top         : 0,
            left        : 0,
            cushion     : 0
        }
    }


    /**
     *
     * @returns {*}
     */
    getClassNames () : string {

        const base : string                      = this.getBaseClass()
        const placement : string | Array<string> = this.props.placement
        if (typeof placement === "string") {
            return this.evaluateClassName( base, placement )
        }
        if (Array.isArray( placement )) {
            return placement.reduce( ( carry : string, position : string ) => {
                return this.evaluateClassName( carry, position )
            }, base )
        }

        return base
    }

    evaluateClassName ( base : string, position : string ) : string {
        switch (position) {
            case "auto":
                return `${base} ${this.getAutoClasses()}`
            case "left":
                return `${base} TooltipLeft`
            case "right":
                return `${base} TooltipRight`
            case "top":
                return `${base} TooltipAbove`
            case "bottom":
                return `${base} TooltipBelow`
            case "element_left":
                return `${base} TooltipAlignLeft`
            case "element_right":
                return `${base} TooltipAlignRight`
            default:
                return base
        }
    }

    /**
     *
     * @returns {string}
     */
    getBaseClass () : string {

        if (typeof this.props.classes === "string") {
            return `${this.props.classes} Tooltip`
        }
        else if (Array.isArray( this.props.classes )) {
            return this.props.classes.reduce( ( carry : string, item : string ) => {
                    return `${carry} ${item}`
                }, "" ) + " Tooltip"
        }

        return "Tooltip "
    }

    /**
     *
     * @returns {string}
     */
    getAutoClasses () : string {
        const half_window_height = window.innerHeight / 2
        const half_window_width  = window.innerWidth / 2
        const element_rect       = this.state.element_rect

        if (element_rect instanceof ClientRect) {
            const horizontal = element_rect.left > half_window_width ? 'TooltipRight' : 'TooltipLeft'
            const vertical   = element_rect.top > half_window_height ? 'TooltipAbove' : 'TooltipBelow'

            return `${horizontal} ${vertical} autoplace`
        }

        return ""
    }

    /**
     *
     *
     * @returns {{left: number, top: number, right: number, bottom: number, width: Number, height: Number}}
     */
    getViewportDimensions () : Object {
        const parent         = this.state.parent
        const element_rect   = this.state.element_rect
        const container_rect = this.state.parent_rect

        if (element_rect instanceof ClientRect && container_rect instanceof ClientRect) {
            const left   = element_rect.left - container_rect.left + parent.scrollLeft
            const top    = element_rect.top - container_rect.top + parent.scrollTop
            const right  = element_rect.right - container_rect.right
            const bottom = element_rect.bottom - container_rect.bottom

            return {
                left  : left,
                top   : top,
                right : right,
                bottom: bottom,
                width : element_rect.width,
                height: element_rect.height
            }
        }

        throw new Error( "Get the ClientRect object from the container and the element first!" )
    }


    /**
     *
     * @returns {{top: number, left: number}}
     */
    getCenteredStyles () : Coordinate {
        const viewport     = this.getViewportDimensions()
        const tooltip      = this.state.tooltip
        const element_rect = this.state.element_rect

        if (tooltip instanceof HTMLElement && element_rect instanceof ClientRect) {
            return {
                top : viewport.top - (tooltip.offsetHeight / 2) + (element_rect.height / 2),
                left: viewport.left - (tooltip.offsetWidth / 2) + (element_rect.width / 2)
            }
        }

        throw new Error( "Attempted to position element prior the the element mounting" )
    }

    auto () : Coordinate {
        const half_window_height = window.innerHeight / 2
        const half_window_width  = window.innerWidth / 2
        const element_rect       = this.state.element_rect

        if (element_rect instanceof ClientRect) {
            const horizontal = element_rect.left > half_window_width ? this.left : this.right
            const vertical   = element_rect.top > half_window_height ? this.above : this.below

            return this.combinePositions( [ horizontal, vertical ] )
        }

        throw new Error( "element_rect must be an instance of ClientRect!" )
    }

    above () : Coordinate {
        const tooltip = this.state.tooltip
        const element = this.state.element
        const cushion = this.state.top_cushion

        if (tooltip instanceof HTMLElement) {
            const centered = this.getCenteredStyles()

            return {
                top : centered.top - ((element.offsetHeight / 2) + (tooltip.offsetHeight / 2) + cushion),
                left: centered.left
            }
        }

        throw new Error( "tooltip is not an instance of htmlelement" )
    }

    below () : Coordinate {

        const centered = this.getCenteredStyles()
        const tooltip  = this.state.tooltip
        const element  = this.state.element
        const cushion  = this.state.top_cushion

        if (tooltip instanceof HTMLElement) {

            return {
                top : centered.top + ((element.offsetHeight / 2) + (tooltip.offsetHeight / 2) + cushion),
                left: centered.left
            }
        }

        throw new Error( "tooltip is not an instance of htmlelement" )
    }

    left () : Coordinate {
        const centered = this.getCenteredStyles()
        const tooltip  = this.state.tooltip
        const element  = this.state.element
        const cushion  = this.state.left_cushion

        if (tooltip instanceof HTMLElement) {

            return {
                top : centered.top,
                left: centered.left - ((element.offsetWidth / 2) + (tooltip.offsetWidth / 2) + cushion),
            }
        }

        throw new Error( "tooltip is not an instance of htmlelement" )
    }

    right () : Coordinate {
        const centered = this.getCenteredStyles()
        const tooltip  = this.state.tooltip
        const element  = this.state.element
        const cushion  = this.state.left_cushion

        if (tooltip instanceof HTMLElement) {
            return {
                top : centered.top,
                left: centered.left + ((element.offsetWidth / 2) + (tooltip.offsetWidth / 2) + cushion),
            }
        }

        throw new Error( "tooltip is not an instance of htmlelement" )
    }

    elementLeft () : Coordinate {
        const centered = this.getCenteredStyles()
        const tooltip  = this.state.tooltip
        const element  = this.state.element
        const cushion  = this.state.left_cushion

        if (tooltip instanceof HTMLElement) {

            const difference = (element.offsetWidth - tooltip.offsetWidth) / 2

            return {
                top : centered.top,
                left: centered.left - difference - cushion,
            }
        }

        throw new Error( "tooltip is not an instance of htmlelement" )
    }

    elementRight () : Coordinate {
        const centered = this.getCenteredStyles()
        const tooltip  = this.state.tooltip
        const element  = this.state.element
        const cushion  = this.state.left_cushion

        if (tooltip instanceof HTMLElement) {

            const difference = (element.offsetWidth - tooltip.offsetWidth) / 2

            return {
                top : centered.top,
                left: centered.left + difference + cushion,
            }
        }

        throw new Error( "tooltip is not an instance of htmlelement" )
    }


    combinePositions ( positions : Array<any> ) : Coordinate {
        const centered : Coordinate = this.getCenteredStyles()
        const coordinates           = positions.map( position => {

            if (typeof position === "function") {
                return position.call( this )
            }

            return this.evaluatePlacement( position )
        } )

        return coordinates.reduce( ( carry : Coordinate, style : Coordinate ) => {
            return {
                top : style.top !== centered.top ? style.top : carry.top,
                left: style.left !== centered.left ? style.left : carry.left,
            }
        }, Object.assign( {}, centered ) )
    }

    evaluatePlacement ( position : string ) : Object {
        switch (position) {
            case "auto":
                return this.auto()
            case "left":
                return this.left()
            case "right":
                return this.right()
            case "top":
                return this.above()
            case "bottom":
                return this.below()
            case "element_left":
                return this.elementLeft()
            case "element_right":
                return this.elementRight()
            default:
                return this.getCenteredStyles()
        }
    }

    /**
     *
     * @returns {{top, left}|*}
     */
    getStyle () : Object {
        if (typeof this.props.placement === "string") {
            return this.evaluatePlacement( this.props.placement )
        }
        if (Array.isArray( this.props.placement )) {
            return this.combinePositions( this.props.placement )
        }

        throw new Error( "placement was not defined correctly on popover" )
    }

    componentWillReceiveProps ( props : Props ) {
        this.setState( {
            element     : props.element,
            parent      : props.parent,
            element_rect: props.element.getBoundingClientRect(),
            parent_rect : props.parent.getBoundingClientRect(),
            classes     : this.getClassNames(),
            open        : props.open,
            top_cushion : props.top_cushion || 0,
            left_cushion: props.left_cushion || 0,
            placement   : props.placement
        } )
    }


    componentDidMount () {
        this.setState( {
            tooltip: ReactDOM.findDOMNode( this )
        } )
    }

    render () {
        if (this.state.open) {

            return (
                <div className = {this.getClassNames() + " visible"} style = {this.getStyle()}>
                    {this.props.children}
                </div>
            )
        }

        return (
            <div
                className = {this.getClassNames()} style = {{visibility: "hidden"}}>
                {this.props.children}
            </div>
        )
    }
}