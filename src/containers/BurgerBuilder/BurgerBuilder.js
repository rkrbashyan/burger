import React, { Component } from 'react';
import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}


class BurgerBuilder extends Component {
    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    };

    componentDidMount() {
        axios.get('/ingredients.json')
            .then((response) => this.setState({ ingredients : response.data }))
            .catch((error) => this.setState({ error: true }));  
    }

    updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients).reduce((acc, curr) => acc += ingredients[curr], 0);

        const newPurchasable = sum > 0;

        this.setState({
            purchasable: newPurchasable
        });
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;

        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice= this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;

        this.setState({
            ingredients: updatedIngredients,
            totalPrice: newPrice
        });

        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        
        if (oldCount <= 0) {
            return;
        }

        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;

        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice= this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;

        this.setState({
            ingredients: updatedIngredients,
            totalPrice: newPrice
        });

        this.updatePurchaseState(updatedIngredients);
    }

    purchaseHandler = () => {
        this.setState({ purchasing: true })
    }

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false })
    }

    purchaseContinueHandler = () => {
        // alert('You continue!');
        const queryParams = [];
        for (let i in this.state.ingredients) {
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        }

        queryParams.push('price=' + this.state.totalPrice);

        const queryString = queryParams.join('&');

        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
        });
    }

    render() {
        const disableInfo = {
            ...this.state.ingredients
        };

        for (let key in disableInfo ) {
            disableInfo[key] = disableInfo[key] <=0;
        }

        let orderSummary = null;

        if (this.state.ingredients) {
            orderSummary = <OrderSummary 
                                ingredients={this.state.ingredients} 
                                purchaseCancelled={this.purchaseCancelHandler} 
                                purchaseContinued={this.purchaseContinueHandler}
                                price={this.state.totalPrice}/>;
        }
        
        if (this.state.loading) {
            orderSummary = <Spinner/>;
        }

        let burger = (
            <Aux>
                <Burger ingredients={this.state.ingredients}/>
                <BuildControls 
                            ingredientAdded={this.addIngredientHandler} 
                            ingredientRemoved={this.removeIngredientHandler}
                            disabled={disableInfo}
                            purchasable={this.state.purchasable}
                            price={this.state.totalPrice}
                            ordered={this.purchaseHandler}/>
            </Aux>);
        
        if (!this.state.ingredients) {
            burger = this.state.error ? <p>Ingedients can't be loaded</p> : <Spinner/>;
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}> 
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);