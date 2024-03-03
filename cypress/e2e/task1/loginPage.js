class LoginPage{
    visitLoginPage(){
        cy.visit('https://www.saucedemo.com/');
    }

    enterUsernameAndPassword(username, password){
        cy.getBySel("username").type(username); 
        cy.getBySel("password").type(password);
        cy.getBySel("login-button").click();
    }

    login(username, password){
        this.visitLoginPage();
        this.enterUsernameAndPassword(username, password);
    }
}

export default LoginPage