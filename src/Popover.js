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

    /**
     * The state will default mostly to uninitialized values
     *
     * @param props
     */
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
     * Use the evaluateClassName method to make sense of an array of positions
     * or a single, string position.
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

    /**
     * Given a position string, return a class name concatenated from some
     * string base
     *
     * @param base
     * @param position
     * @returns {string}
     */
    evaluateClassName ( base : string = "", position : string ) : string {
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
     * Get the base class. The format is always {user supplied class names} {Tooltip}.
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
     * When auto-aligning a tooltip, get appropriate class names appended with
     * a class name called autoplace to help with CSS.
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
     * Figure out where the element we're sticking the tooltip resides relative
     * to the viewport.
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
     * Figure out what the top and left properties look like if we want the tooltip
     * to be dead center of the element we're sticking it to.
     *
     * @returns {Coordinate}
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

    /**
     * Apply an intelligent mix of left/right and above/below based on
     * an element's position in the viewport.
     *
     * @returns {Coordinate}
     */
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

    /**
     * Place the tooltip above the element.
     *
     * @returns {{top: number, left: number}}
     */
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

    /**
     * Place the tooltip below the element.
     *
     * @returns {{top: number, left: number}}
     */
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

    /**
     * Place the tooltip to the left of the element
     *
     * @returns {{top: number, left: number}}
     */
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

    /**
     * Place the tooltip to the right of the element
     *
     * @returns {{top: number, left: number}}
     */
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

    /**
     * Aligns the left side of the tooltip with the left side of the element
     *
     * @returns {{top: number, left: number}}
     */
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

    /**
     * Aligns the right side of the tooltip with the right side of the element
     *
     * @returns {{top: number, left: number}}
     */
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


    /**
     * Given positions as an array of strings or an array of functions,
     * combine them into a single Coordinate object we can use for
     * placement.
     *
     * @param positions
     * @returns {Coordinate}
     */
    combinePositions ( positions : Array<any> ) : Coordinate {
        const centered : Coordinate = this.getCenteredStyles()
        //Get the coordinates from the individual positions that were supplied
        const coordinates           = positions.map( position => {
            return typeof position === "function"
                    ? position.call(this)
                    : this.evaluatePlacement(position)
        } )

        //Reduce the coordinates to a single coordinate
        return coordinates.reduce( ( carry : Coordinate, style : Coordinate ) => {
            return {
                top : style.top !== centered.top ? style.top : carry.top,
                left: style.left !== centered.left ? style.left : carry.left,
            }
        }, Object.assign( {}, centered ) )
    }

    /**
     * Based on a single placement string, return a Coordinate.
     *
     * @param position
     * @returns {Coordinate}
     */
    evaluatePlacement ( position : string ) : Coordinate {
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
     * Get the style that will be applied to the tooltip, or throw an
     * error if placement is undefined
     *
     * @returns {Coordinate}
     */
    getStyle () : Coordinate {
        if (typeof this.props.placement === "string") {
            return this.evaluatePlacement( this.props.placement )
        }
        if (Array.isArray( this.props.placement )) {
            return this.combinePositions( this.props.placement )
        }

        throw new Error( "placement was not defined correctly on popover" )
    }

    /**
     * Update all of our state when the next props are ready
     *
     * @param props
     */
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


    /**
     * When the component mounts, set a reference to its own DOM node
     */
    componentDidMount () {
        this.setState( {
            tooltip: ReactDOM.findDOMNode( this )
        } )
    }

    render () {
        //When open, apply styles and add the class name visible
        if (this.state.open) {
            return (
                <div className = {this.getClassNames() + " visible"} style = {this.getStyle()}>
                    {this.props.children}
                </div>
            )
        }
        //when closed, don't apply the class name visible, and it's only applied style should be hidden
        return (
            <div
                className = {this.getClassNames()} style = {{visibility: "hidden"}}>
                {this.props.children}
            </div>
        )
    }
}