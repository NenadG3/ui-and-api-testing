///<reference types="cypress" />

describe('testing endpoints for creating, updating and deleting user', ()=> {
    before('clear storage and cookies', ()=> {
        cy.window().then(win => win.sessionStorage.clear());
        cy.clearLocalStorage();
        cy.clearCookies();
    })

    it('verify that new user can be created', ()=> {
        cy.request({
            method: 'POST',
            url: Cypress.env('gorestUrl') + '/public/v2/users',
            headers: {
                'Authorization': 'Bearer ' + Cypress.env('authToken')
                    },
            body: {
                name: 'John',
                email: Math.random().toString(5).substring(2)+'@example',
                gender: 'male',
                status: 'active'
            }
        })
        .then((response)=>{
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property('id');
            expect(response.body.name).to.be.eq('John');
            expect(response.body.gender).to.be.eq('male');
            expect(response.body.status).to.be.eq('active');
        })
    })

    it('verify that user can not be created with same email', ()=> {
        //I added custom command for creating user for next tests since i need creation of user to run them independently
        cy.createUser()
        .then((createUserResponse)=>{
            expect(createUserResponse.status).to.eq(201);
            expect(createUserResponse.body).to.have.property('email');

            //stored value of 'email' as environment variable so it can be used as body parameter in request
            Cypress.env('existingEmail', createUserResponse.body.email);

            cy.request({
                method: 'POST',
                url: Cypress.env('gorestUrl') + '/public/v2/users',
                headers: {
                    'Authorization': 'Bearer ' + Cypress.env('authToken')
                        },
                body: {
                    name: 'John',
                    email: Cypress.env('existingEmail'),
                    gender: 'male',
                    status: 'active'
                },
                failOnStatusCode: false
            })
            .then((response)=>{
                expect(response.status).to.be.eq(422)
            })
        })
    })

    it('verify that user status can be updated', ()=>{
        cy.createUser()
        .then((createUserResponse)=>{
            expect(createUserResponse.status).to.eq(201);
            expect(createUserResponse.body.status).to.eq('active');
            Cypress.env('newUserId', createUserResponse.body.id);

            cy.request({
                method: 'PUT',
                url: Cypress.env('gorestUrl') + '/public/v2/users/' + Cypress.env('newUserId'),
                headers: {
                    'Authorization': 'Bearer ' + Cypress.env('authToken')
                },
                body: {
                    status: 'inactive'
                },
                failOnStatusCode: false
            })
            .then((response)=>{
                expect(response.status).to.be.eq(200);
                expect(response.body.status).to.eq('inactive');
            })
        })
    })

    it('verify that gender can not be updated as blank',()=>{
        cy.createUser()
        .then((createUserResponse)=>{
            expect(createUserResponse.status).to.eq(201);
            expect(createUserResponse.body.gender).to.eq('male');
            Cypress.env('newUserId', createUserResponse.body.id);

            cy.request({
                method: 'PUT',
                url: Cypress.env('gorestUrl') + '/public/v2/users/' + Cypress.env('newUserId'),
                headers: {
                    'Authorization': 'Bearer ' + Cypress.env('authToken')
                        },
                body: {
                    status: ''
                },
                failOnStatusCode: false
            })
            .then((response)=>{
                expect(response.status).to.be.eq(422);
            })
        })
    })

    it('verify that user can be deleted', ()=> {
        cy.createUser()
        .then((createUserResponse)=>{
            expect(createUserResponse.status).to.eq(201);
            expect(createUserResponse.body).to.have.property('id');
            Cypress.env('newUserId', createUserResponse.body.id);

            cy.request({
                method: 'DELETE',
                url: Cypress.env('gorestUrl') + '/public/v2/users/' + Cypress.env('newUserId'),
                headers: {
                    'Authorization': 'Bearer ' + Cypress.env('authToken')
                }
            })
            .then((response)=>{
                expect(response.status).to.be.eq(204);
            })
        })
    })
})