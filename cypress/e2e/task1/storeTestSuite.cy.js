///<reference types="cypress" />

//created class with login method so i can reuse it beforeEach test 
import LoginPage from "./loginPage";

describe('verifying cart functionality ', {
    viewportHeight: 1080,
    viewportWidth: 1920
        }, () => {
    const sauceDemo = new LoginPage();

    before('clear storage and cookies', ()=> {
        cy.window().then(win => win.sessionStorage.clear());
        cy.clearLocalStorage();
        cy.clearCookies();
    })

    beforeEach('visit store page and login', ()=> {
        sauceDemo.login('standard_user', 'secret_sauce');
    })
  
    
    /* cy.getBySel and cy.openShoppingCart commands are created for better code clarity
    since a lot of elements have data-test attribute and cart is opened in every test */
    it('verify that item is added to cart', () => {
        cy.get('.shopping_cart_badge').should('not.exist');
        cy.getBySel("add-to-cart-sauce-labs-bolt-t-shirt").click();
        cy.getBySel("remove-sauce-labs-bolt-t-shirt").should('be.visible');
        cy.get('.shopping_cart_badge').should('have.text', '1');
        cy.openShoppingCart();
        cy.get('.title').should('have.text', 'Your Cart');
        cy.get('.inventory_item_name').should('have.text', 'Sauce Labs Bolt T-Shirt');
    })

    it('verify that one item from the list and another from detail page are added to cart', ()=> {
        cy.getBySel("add-to-cart-sauce-labs-bolt-t-shirt").click();
        cy.contains('Sauce Labs Fleece Jacket').click();
        cy.getBySel("back-to-products").should('be.visible');
        cy.get('.inventory_details_name').should('have.text', 'Sauce Labs Fleece Jacket');
        cy.getBySel("add-to-cart-sauce-labs-fleece-jacket").click();
        cy.get('.shopping_cart_badge').should('have.text', '2');
        cy.openShoppingCart();
        cy.get('.title').should('have.text', 'Your Cart');
        cy.getBySel("remove-sauce-labs-bolt-t-shirt").should('be.visible');
        cy.getBySel("remove-sauce-labs-fleece-jacket").should('be.visible');
    })

    it('verify that one of two added items is removed from the cart', ()=> {
        cy.getBySel("add-to-cart-sauce-labs-bolt-t-shirt").click();
        cy.contains('Sauce Labs Fleece Jacket').click();
        cy.getBySel("add-to-cart-sauce-labs-fleece-jacket").click();
        cy.openShoppingCart();
        cy.get('.title').should('have.text', 'Your Cart');
        cy.get('.shopping_cart_badge').should('have.text','2')
        cy.contains("Sauce Labs Bolt T-Shirt").should('be.visible');
        cy.contains("Sauce Labs Fleece Jacket").should('be.visible');
        cy.getBySel("remove-sauce-labs-fleece-jacket").click();
        cy.get('.shopping_cart_badge').should('have.text', '1');
        cy.contains("Sauce Labs Bolt T-Shirt").should('be.visible');
        cy.contains("Sauce Labs Fleece Jacket").should('not.exist');
    })

    it('verify that order can be completed', ()=> {
        cy.getBySel("add-to-cart-sauce-labs-bolt-t-shirt").click();
        cy.contains('Sauce Labs Fleece Jacket').click();
        cy.getBySel("add-to-cart-sauce-labs-fleece-jacket").click();
        cy.openShoppingCart();
        cy.getBySel("remove-sauce-labs-fleece-jacket").click();
        cy.getBySel("checkout").click();
        cy.getBySel("firstName").type('John');
        cy.getBySel("lastName").type('Smith');
        cy.getBySel("postalCode").type('43000');
        cy.getBySel("continue").click();
        cy.getBySel("finish").click();
        cy.get('.title').should('have.text', 'Checkout: Complete!');
        cy.get('.complete-header').should('have.text', 'Thank you for your order!');
        cy.get('.complete-text').should('have.text', 'Your order has been dispatched, and will arrive just as fast as the pony can get there!');
    })
})