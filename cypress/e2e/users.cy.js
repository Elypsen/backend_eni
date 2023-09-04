import * as uuid from 'uuid'

describe('Testing users', () => {
  it('Je ne peux pas créer un compte avec une adresse email qui existe déjà', () => {
    cy.visit('/users/create')
    cy.get('input[name="email"]').type('admin@express-brains.local')
    cy.get("button[type='submit']").click()
    cy.contains('Cette adresse email est déjà utilisée')
  })

  it("L'adresse email est obligatoire en création de compte", () => {
    cy.visit('/users/create')
    cy.get("button[type='submit']").click()
    cy.contains('Merci de saisir une adresse email valide')
  })

  it('Le mot de passe doit faire au moins 4 caractères', () => {
    cy.visit('/users/create')
    cy.get('input[name="password"]').type('123')
    cy.get("button[type='submit']").click()
    cy.contains('Merci de saisir une adresse email valide')
  })

  it('Le mot de passe doit être saisi deux fois de façon identique', () => {
    cy.visit('/users/create')
    cy.get('input[name="password"]').type('123')
    cy.get('input[name="passwordConfirmation"]').type('456')
    cy.get("button[type='submit']").click()
    cy.contains('Les mots de passes ne correspondent pas')
  })

  it('Je reçois un message de confirmation lorsque mon compte est créé et je suis capable de me connecter avec', () => {
    cy.visit('/users/create')
    const email = uuid.v4() + '@express-brains.local'
    cy.get('input[name="email"]').type(email)
    cy.get('input[name="password"]').type('1234')
    cy.get('input[name="passwordConfirmation"]').type('1234')
    cy.get("button[type='submit']").click()
    cy.contains(`Votre compte ${email} a bien été créé`)
    cy.get('input[name="email"]').type(email)
    cy.get('input[name="password"]').type('1234')
    cy.get("button[type='submit']").click()
    cy.contains(`Bonjour ${email}`)
  })
})
