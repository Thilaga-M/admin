import React, { Component } from "react";
import "./Print.css"

class PrintWarpper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            component: props.component,
        };
    }

    render(){
        return this.state.component;
    }
}

export default class PrintComponent extends Component {
    constructor(props) {
        super(props);
        if (PrintComponent.Instance) {
            throw "Can and only have one <Print /> element";
        }
        this.generateClassName = this.generateClassName.bind(this);
        PrintComponent.Instance = this;

        this.state = {
            component: props.component,
            print: false,
            singlePage: props.singlePage,
        };
    }
    /**
     * @type {PrintComponent}
     */
    static Instance;

    static SetPrintContent(component) {
        var xs = [];
        var x = <PrintWarpper component={component} />;
        xs.push(x);
        PrintComponent.Instance.setState({
            component: xs,
        });
    }

    static AddPrintContent(component) {
        var xs = PrintComponent.Instance.state.component;
        if (!xs) xs = [];
        var x = <PrintWarpper component={component} />;
        xs.push(x);
        PrintComponent.Instance.setState({ component: xs });
    }

    static GetPrintComponent() {
        return PrintComponent.Instance.state.component;
    }

    static ClearComponent() {
        
        PrintComponent.Instance.setState({ component: [] });
    }

    static Print() {
        PrintComponent.Instance.setState({
            print: true,
        });
        PrintComponent.Instance.forceUpdate();
        setTimeout(() => {
            window.print();
            PrintComponent.Instance.setState({
                print: false,
            });
            PrintComponent.Instance.forceUpdate();
        }, 1000);

    }

    generateClassName() {
        let print = this.state.print
            ? "react-print-print "
            : "react-print-hidden ";
        let page = this.state.singlePage
            ? "react-print-single"
            : "react-print-multi";
        return print + page;
    }

    render() {
        return (
            <div
                className={this.generateClassName()} >
                {this.state.component ? this.state.component : false}
            </div>
        );
    }
}