import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const purchaseBurgerSuccess = (id, orderData) => {
	return {
		type: actionTypes.PURCHASE_BURGER_SUCCESS,
		orderId: id,
		orderData: orderData
	};
};

export const purchaseBurgerFailed = (error) => {
	return {
		type: actionTypes.PURCHASE_BURGER_FAILED,
		error: error
	};
};

export const purchaseBurgerStart = () => {
	return {
		type: actionTypes.PURCHASE_BURGER_START
	};
};

export const purchaseInit = () => {
	return {
		type: actionTypes.PURCHASE_INIT
	};
};

export const purchaseBurger = (orderData, token) => (dispatch) => {
	dispatch(purchaseBurgerStart());

	axios
		.post('/orders.json?auth=' + token, orderData)
		.then((response) => {
			dispatch(purchaseBurgerSuccess(response.data.name, orderData));
		})
		.catch((error) => {
			dispatch(purchaseBurgerFailed(error));
		});
};

export const fetchOrderSuccess = (orders) => {
	return {
		type: actionTypes.FETCH_ORDERS_SUCCESS,
		orders: orders
	};
};

export const fetchOrderFailed = (error) => {
	return {
		type: actionTypes.FETCH_ORDERS_FAILED,
		error: error
	};
};

export const fetchOrderStart = () => {
	return {
		type: actionTypes.FETCH_ORDERS_START
	};
};

export const fetchOrders = (token) => (dispatch) => {
	dispatch(fetchOrderStart());

	axios
		.get('/orders.json?auth=' + token)
		.then((res) => {
			const fetchedOrders = [];
			for (let key in res.data) {
				fetchedOrders.push({ ...res.data[key], id: key });
			}
			dispatch(fetchOrderSuccess(fetchedOrders));
		})
		.catch((error) => {
			dispatch(fetchOrderFailed(error));
		});
};
