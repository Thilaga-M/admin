import React from 'react';
import './autocomplete.css';

class Autocomplete extends React.Component {

	constructor ( props, context ) {
		super( props, context );

		this.state = {
			selected: false,
			hover: false,
			results: this.props.results,
			loading: this.props.loading,
			value:'',
			placeholder:(this.props.placeholder)?this.props.placeholder:'Search...'
		};
	}

	componentWillReceiveProps( nextProps ) {
		this.setState( {
			selected: false,
			hover: false,
			results: nextProps.results,
			loading: nextProps.loading,
			value:nextProps.value,
			placeholder:nextProps.placeholder

		} );
	}

	onChange( e ) {
		this.props.onSearch( e.target.value );
	}

	onKeyUp( e ) {
		var
			keyCode = e.keyCode || e.which,	hover = false,	selected = false,state = {
				results: this.state.results,
				loading: this.state.loading
			};

		if( this.state.results.length ) {
			switch( keyCode ) {
				case 38: // up
					if(
						this.state.hover === false ||
						( this.state.hover - 1 ) < 0
					) {
						hover = this.state.results.length - 1;
					} else {
						hover = this.state.hover - 1;
					}

					break;

				case 40: // down
					if(
						this.state.hover === false ||
						( this.state.hover + 1 ) > ( this.state.results.length - 1 )
					) {
						hover = 0;
					} else {
						hover = this.state.hover + 1;
					}

					break;

				case 13: // enter
					if( this.state.hover !== false )
						selected = this.state.hover;
					break;
				default:
				break;
			}
		}

		if( selected === false ) {
			state.selected = false;
			state.hover = hover;

			this.setState( state );
		} else {
			this.select( selected );
		}
	}

	onBlur( e ) {
		 setTimeout( function(){
			var state = { };
			state.selected = false;
			state.hover = false;
			state.results = [ ];

			this.setState( state );
		}.bind( this ), 20 ); 
	}

	select( index ) {
		var state = { };
		state.selected = index;
		state.hover = false;
		//React.findDOMNode( this.refs.input ).value = "";

 		// call the callback
		this.props.onSelect( this.state.results[ state.selected ]["result"], state.selected );
		state.results = [ ];

		this.setState( state );
	}

	render( ) {
		return (
			<div className="autocomplete">
				<input onBlur={this.onBlur.bind(this)} onKeyUp={this.onKeyUp.bind( this )} onChange={this.onChange.bind( this )} placeholder={this.state.placeholder} value={this.state.value} className="form-control" /> 
				{function( ){
					if( this.state.loading ) {
						return (
							<div className="autocomplete-loading">
								<div className="cssload-loader">
									<div className="cssload-inner cssload-one"></div>
									<div className="cssload-inner cssload-two"></div>
									<div className="cssload-inner cssload-three"></div>
								</div>
							</div>
						);
					}

					return "";
				}.bind( this )( )}

				<div style={{clear: "both"}} />

				{function(){
					if( this.state.results.length ) {
						return <div className="autocomplete-list">{( !this.state.selected ) ? this.state.results.map(function( item, index ){
							return React.cloneElement( this.props.children( item.value), {
								className: "autocomplete__item " + ( ( this.state.hover !== false && this.state.hover === index ) ? 'hover' : '' ),
								key:index,
								onClick: this.select.bind( this, index )
							} );
						}.bind( this )) : ''}</div>
					} else return "";
				}.bind(this)()}
			</div>
		);
	}
}

Autocomplete.contextTypes = {
  children: React.PropTypes.func
};
export default Autocomplete;