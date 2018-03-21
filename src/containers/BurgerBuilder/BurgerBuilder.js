import React, { Component } from 'react';
import Auxilary  from '../../hoc/Auxilary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';

import { connect } from 'react-redux';
import * as actions from '../../store/actions/';

// We exporting class directly for testing purposses!!!
export class BurgerBuilder extends Component {
	state = {
		purchasing: false
	};

	componentDidMount() {
		this.props.onInitIngredients();
	}

	updatePurchaseState = (ingredients) => {
		if (!ingredients) {
			return false;
		}

		const sum = Object.keys(ingredients).reduce(
			(acc, curr) => (acc += ingredients[curr]),
			0
		);

		return sum > 0;
	};

	purchaseHandler = () => {
		if (this.props.isAuthenticated) {
			this.setState({ purchasing: true });
		} else {
			this.props.onSetAuthRedirectPath('/checkout');
			this.props.history.push('/auth');
		}
	};

	purchaseCancelHandler = () => {
		this.setState({ purchasing: false });
	};

	purchaseContinueHandler = () => {
		this.props.onInitPurchase();
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

		let burger = (
			<Auxilary >
				<Burger ingredients={this.props.ings} />
				<BuildControls
					ingredientAdded={this.props.onIngredientAdded}
					ingredientRemoved={this.props.onIngredientRemoved}
					disabled={disableInfo}
					purchasable={this.updatePurchaseState(this.props.ings)}
					isAuth={this.props.isAuthenticated}
					price={this.props.totalPrice}
					ordered={this.purchaseHandler}
				/>
			</Auxilary >
		);

		if (!this.props.ings) {
			burger = this.props.error ? (
				<p>Ingedients can't be loaded</p>
			) : (
				<Spinner />
			);
		}

		return (
			<Auxilary >
				<Modal
					show={this.state.purchasing}
					modalClosed={this.purchaseCancelHandler}
				>
					{orderSummary}
				</Modal>
				{burger}
			</Auxilary >
		);
	}
}

const mapStateToProps = (state) => {
	return {
		ings: state.burgerBuilder.ingredients,
		totalPrice: state.burgerBuilder.totalPrice,
		error: state.burgerBuilder.error,
		isAuthenticated: state.auth.token !== null
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onIngredientAdded: (ingName) =>
			dispatch(actions.addIngredient(ingName)),
		onIngredientRemoved: (ingName) =>
			dispatch(actions.removeIngredient(ingName)),
		onInitIngredients: () => dispatch(actions.initIngredients()),
		onInitPurchase: () => dispatch(actions.purchaseInit()),
		onSetAuthRedirectPath: (path) =>
			dispatch(actions.setAuthRedirectPath(path))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(
	withErrorHandler(BurgerBuilder, axios)
);
