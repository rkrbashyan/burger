import React from 'react';
import classes from './Order.css';

const order = (props) => {
    console.log(props.order.ingredients)
    let  ingredientsString = '';

    for (let ingKey in props.order.ingredients) {
        ingredientsString += ingKey.charAt(0).toUpperCase() + ingKey.slice(1)
            + '(' + props.order.ingredients[ingKey] + ') ';
    }
    
    return (
    <div className={classes.Order}>
        <p>Ingredients: {ingredientsString}</p>
        <p>Price:<strong>{ (+props.order.price).toFixed(2)} USD</strong></p>
    </div>
)}

export default order;