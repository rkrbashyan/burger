import React, { Component } from 'react';
import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';

import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';

class BurgerBuilder extends Component {
	state = {
		purchasing: false,
		loading: false,
		error: false
	};

	componentDidMount() {
		/*         axios.get('/ingredients.json')
            .then((response) => this.setState({ ingredients : response.data }))
            .catch((error) => this.setState({ error: true }));   */
	}

	updatePurchaseState = (ingredients) => {
		const sum = Object.keys(ingredients).reduce(
			(acc, curr) => (acc += ingredients[curr]),
			0
		);

		return sum > 0;
	};

	purchaseHandler = () => {
		this.setState({ purchasing: true });
	};

	purchaseCancelHandler = () => {
		this.setState({ purchasing: false });
	};

	purchaseContinueHandler = () => {
		this.props.history.push('/checkout');
	};

	render() {
		const disableInfo = {
			...this.props.ings
		};

		for (let key in disableInfo) {
			disableInfo[key] = disableInfo[key] <= 0;
		}

		let orderSummary = null;

		if (this.props.ings) {
			orderSummary = (
				<OrderSummary
					ingredients={this.props.ings}
					purchaseCancelled={this.purchaseCancelHandler}
					purchaseContinued={this.purchaseContinueHandler}
					price={this.props.totalPrice}
				/>
			);
		}

		if (this.state.loading) {
			orderSummary = <Spinner />;
		}

		let burger = (
			<Aux>
				<Burger ingredients={this.props.ings} />
				<BuildControls
					ingredientAdded={this.props.onIngredientAdded}
					ingredientRemoved={this.props.onIngredientRemoved}
					disabled={disableInfo}
					purchasable={this.updatePurchaseState(this.props.ings)}
					price={this.props.totalPrice}
					ordered={this.purchaseHandler}
				/>
			</Aux>
		);

		if (!this.props.ings) {
			burger = this.state.error ? (
				<p>Ingedients can't be loaded</p>
			) : (
				<Spinner />
			);
		}

		return (
			<Aux>
				<Modal
					show={this.state.purchasing}
					modalClosed={this.purchaseCancelHandler}
				>
					{orderSummary}
				</Modal>
				{burger}
			</Aux>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		ings: state.ingredients,
		totalPrice: state.totalPrice
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onIngredientAdded: (ingName) =>
			dispatch({
				type: actionTypes.ADD_INGREDIENT,
				ingredientName: ingName
			}),
		onIngredientRemoved: (ingName) =>
			dispatch({
				type: actionTypes.REMOVE_INGREDIENT,
				ingredientName: ingName
			})
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(
	withErrorHandler(BurgerBuilder, axios)
);
