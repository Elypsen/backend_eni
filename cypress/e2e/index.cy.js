describe('Test du jeu', () => {
  it('Je ne peux pas envoyer le formulaire pour deviner le nombre sans choisir un nombre', () => {
    cy.visit('/')
    cy.get("button[type='submit']").click()
    cy.contains('Erreur ! Vous devez saisir un nombre')
  })

  it("J'envoie le formulaire pour deviner le nombre en choisissant un nombre", () => {
    cy.visit('/')
    cy.get("input[type='number']").type(50)
    cy.get("button[type='submit']").click()
    cy.contains('Erreur ! Vous devez saisir un nombre').should('not.exist')
  })
})
