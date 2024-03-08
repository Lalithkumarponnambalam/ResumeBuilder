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

describe('Languages e2e test', () => {
  const languagesPageUrl = '/languages';
  const languagesPageUrlPattern = new RegExp('/languages(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const languagesSample = {};

  let languages: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/languages+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/languages').as('postEntityRequest');
    cy.intercept('DELETE', '/api/languages/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (languages) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/languages/${languages.id}`,
      }).then(() => {
        languages = undefined;
      });
    }
  });

  it('Languages menu should load Languages page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('languages');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Languages').should('exist');
    cy.url().should('match', languagesPageUrlPattern);
  });

  describe('Languages page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(languagesPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Languages page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/languages/new$'));
        cy.getEntityCreateUpdateHeading('Languages');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', languagesPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/languages',
          body: languagesSample,
        }).then(({ body }) => {
          languages = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/languages+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [languages],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(languagesPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Languages page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('languages');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', languagesPageUrlPattern);
      });

      it('edit button click should load edit Languages page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Languages');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', languagesPageUrlPattern);
      });

      it('last delete button click should delete instance of Languages', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('languages').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', languagesPageUrlPattern);

        languages = undefined;
      });
    });
  });

  describe('new Languages page', () => {
    beforeEach(() => {
      cy.visit(`${languagesPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Languages');
    });

    it('should create an instance of Languages', () => {
      cy.get(`[data-cy="langOption"]`).select('Japanese');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        languages = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', languagesPageUrlPattern);
    });
  });
});
