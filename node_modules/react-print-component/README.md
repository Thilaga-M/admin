# React Print Component
    Print your component!

## Arguments

| Name | Type | Default | Description |
| :- | :- | :- | :- |
| singlePage | boolean | | Add a `react-print-single` class to print `<div>`

## Example Usage

1. Add `<PrintComponent />` Element to your root element

    ```jsx

    ...

    render() {
        return (
            <div>
                <PrintComponent />
                <div className="main-root"></div>
            </div>
        );
    }

    ...

    ```

2. Use static functions to print your components.
    ```js
    import PrintComponent from 'react-print-component';

    export class TestComponent() {

        ...

        onPrintButtonClick() {
            //Replace components added
            PrintComponent.SetPrintContent(this.render());
            //Add components to list
            PrintComponent.AddPrintContent(this.render());
            PrintComponent.AddPrintContent(<div>{"Mulit element"}</div>);
            //Clear all added components in list
            PrintComponent.ClearComponent();
            ...
            do something
            ...

            //Call this method to print
            PrintComponent.Print();
        }

        ...
    }
    ```

3. Write print style in `@media`
    ```css
        @media print {
            
            ...
            
            h1 {}
            h2 {}
            button {}
            input[type=text] {}

            ...
        }
    ```
