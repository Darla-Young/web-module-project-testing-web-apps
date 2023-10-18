import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

test('renders without errors', () => {
    render(<ContactForm />);
});

test('renders the contact form header', () => {
    render(<ContactForm />);
    const header = screen.getByRole('heading', {  name: /contact form/i});
    expect(header).toBeInTheDocument();
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm />);
    const nameInput = screen.getByRole('textbox', {  name: /first name\*/i});
    await userEvent.type(nameInput, 'Edd');
    const error = screen.getAllByTestId('error');
    expect(error).toHaveLength(1);
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm />);
    const submit = screen.getByText(/submit/i);
    await userEvent.click(submit);
    const errors = screen.getAllByTestId('error');
    expect(errors).toHaveLength(3);
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm />);
    const fName = screen.getByRole('textbox', {  name: /first name\*/i});
    const lName = screen.getByRole('textbox', {  name: /last name\*/i});
    const submit = screen.getByRole('button', {  name: /submit/i});
    await userEvent.type(fName, 'Foobar');
    await userEvent.type(lName, 'Foobar');
    await userEvent.click(submit);
    const errors = screen.getAllByTestId('error');
    expect(errors).toHaveLength(1);
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm />);
    const email = screen.getByRole('textbox', {  name: /email\*/i});
    await userEvent.type(email, 'invalid email');
    const errors = screen.getByText(/error: email must be a valid email address\./i);
    expect(errors).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm />);
    const submit = screen.getByRole('button', {  name: /submit/i});
    await userEvent.click(submit);
    const error = screen.getByText(/error: lastname is a required field\./i);
    expect(error).toBeInTheDocument();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm />);
    const fName = screen.getByRole('textbox', {  name: /first name\*/i});
    const lName = screen.getByRole('textbox', {  name: /last name\*/i});
    const email = screen.getByRole('textbox', {  name: /email\*/i});
    const submit = screen.getByRole('button', {  name: /submit/i});
    await userEvent.type(fName, "abcde");
    await userEvent.type(lName, "f");
    await userEvent.type(email, "g@h.i");
    await userEvent.click(submit);
    const message = screen.queryByTestId("messageDisplay");
    expect(message).not.toBeInTheDocument();
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm />);
    const fName = screen.getByRole('textbox', {  name: /first name\*/i});
    const lName = screen.getByRole('textbox', {  name: /last name\*/i});
    const email = screen.getByRole('textbox', {  name: /email\*/i});
    const message = screen.getByRole('textbox', {  name: /message/i});
    const submit = screen.getByRole('button', {  name: /submit/i});
    await userEvent.type(fName, "abcde");
    await userEvent.type(lName, "f");
    await userEvent.type(email, "g@h.i");
    await userEvent.type(message, "j");
    await userEvent.click(submit);
    const display = [
        screen.getByTestId('firstnameDisplay'),
        screen.getByTestId('lastnameDisplay'),
        screen.getByTestId('emailDisplay'),
        screen.getByTestId('messageDisplay')
    ];
    display.forEach(i => {
        expect(i).toBeInTheDocument();
    });

});
