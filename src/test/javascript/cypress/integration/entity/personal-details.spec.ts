import { entityItemSelector } from '../../support/commands';
import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('PersonalDetails e2e test', () => {
  const personalDetailsPageUrl = '/personal-details';
  const personalDetailsPageUrlPattern = new RegExp('/personal-details(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const personalDetailsSample = { firstName: 'Danial', lastName: 'Goyette', email: 'Raven17@hotmail.com' };

  let personalDetails: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/personal-details+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/personal-details').as('postEntityRequest');
    cy.intercept('DELETE', '/api/personal-details/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (personalDetails) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/personal-details/${personalDetails.id}`,
      }).then(() => {
        personalDetails = undefined;
      });
    }
  });

  it('PersonalDetails menu should load PersonalDetails page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('personal-details');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('PersonalDetails').should('exist');
    cy.url().should('match', personalDetailsPageUrlPattern);
  });

  describe('PersonalDetails page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(personalDetailsPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create PersonalDetails page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/personal-details/new$'));
        cy.getEntityCreateUpdateHeading('PersonalDetails');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', personalDetailsPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/personal-details',
          body: personalDetailsSample,
        }).then(({ body }) => {
          personalDetails = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/personal-details+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [personalDetails],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(personalDetailsPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details PersonalDetails page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('personalDetails');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', personalDetailsPageUrlPattern);
      });

      it('edit button click should load edit PersonalDetails page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('PersonalDetails');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', personalDetailsPageUrlPattern);
      });

      it('last delete button click should delete instance of PersonalDetails', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('personalDetails').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', personalDetailsPageUrlPattern);

        personalDetails = undefined;
      });
    });
  });

  describe('new PersonalDetails page', () => {
    beforeEach(() => {
      cy.visit(`${personalDetailsPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('PersonalDetails');
    });

    it('should create an instance of PersonalDetails', () => {
      cy.setFieldImageAsBytesOfEntity('profilePhoto', 'integration-test.png', 'image/png');

      cy.get(`[data-cy="firstName"]`).type('Alysa').should('have.value', 'Alysa');

      cy.get(`[data-cy="lastName"]`).type('Harris').should('have.value', 'Harris');

      cy.get(`[data-cy="email"]`).type('German20@yahoo.com').should('have.value', 'German20@yahoo.com');

      cy.get(`[data-cy="phone"]`).type('1-998-317-4781').should('have.value', '1-998-317-4781');

      cy.get(`[data-cy="address"]`).type('California').should('have.value', 'California');

      cy.get(`[data-cy="city"]`).type('Hannabury').should('have.value', 'Hannabury');

      cy.get(`[data-cy="state"]`).type('Configuration').should('have.value', 'Configuration');

      cy.get(`[data-cy="zipCode"]`).type('21525-3425').should('have.value', '21525-3425');

      cy.get(`[data-cy="country"]`).type('Kyrgyz Republic').should('have.value', 'Kyrgyz Republic');

      // since cypress clicks submit too fast before the blob fields are validated
      cy.wait(200); // eslint-disable-line cypress/no-unnecessary-waiting
      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        personalDetails = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', personalDetailsPageUrlPattern);
    });
  });
});
