import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.css';
import axios from '../../../axios-orders';

class ContactData extends Component {
    state = {
        name: '',
        email: '',
        address: {
            street: '',
            postalCode: ''
        },
        loading : false
    }

    orderHandler = (event) => {
        event.preventDefault(); // to prevent default form submission
        this.setState({ loading:true });

        const order = {
            ingredients: this.props.ingredients,
            price: this.props.totalPrice,
            customer: {
                name: this.state.name,
                address: {
                    street: this.state.address.street,
                    zipCode: this.state.address.postalCode
                },
                email: this.state.email
            },
            deliveryMethod: 'fastest'
        };

        

        axios.post('/orders.json', order)
            .then((response) => { 
                this.setState({ loading:false });
                this.props.history.push("/");
            })
            .catch((error) => {
                this.setState({ loading:false })
                this.props.history.push("/");
            });
    }

    render () {
        let form = (
            <form>
                <input className={classes.Input} type="text" name="name" placeholder="Your name" />
                <input className={classes.Input} type="text" name="email" placeholder="Your email" />
                <input className={classes.Input} type="text" name="street" placeholder="Your street" />
                <input className={classes.Input} type="text" name="postalCode" placeholder="Your Postal Code" />
                <Button btnType="Success" clicked={this.orderHandler}>ORDER</Button>
            </form>
        );

        if (this.state.loading) {
            form = <Spinner/>;
        }

        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        );
    }
}

export default ContactData;