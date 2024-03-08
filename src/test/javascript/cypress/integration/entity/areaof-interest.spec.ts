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

describe('AreaofInterest e2e test', () => {
  const areaofInterestPageUrl = '/areaof-interest';
  const areaofInterestPageUrlPattern = new RegExp('/areaof-interest(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const areaofInterestSample = {};

  let areaofInterest: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/areaof-interests+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/areaof-interests').as('postEntityRequest');
    cy.intercept('DELETE', '/api/areaof-interests/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (areaofInterest) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/areaof-interests/${areaofInterest.id}`,
      }).then(() => {
        areaofInterest = undefined;
      });
    }
  });

  it('AreaofInterests menu should load AreaofInterests page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('areaof-interest');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('AreaofInterest').should('exist');
    cy.url().should('match', areaofInterestPageUrlPattern);
  });

  describe('AreaofInterest page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(areaofInterestPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create AreaofInterest page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/areaof-interest/new$'));
        cy.getEntityCreateUpdateHeading('AreaofInterest');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', areaofInterestPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/areaof-interests',
          body: areaofInterestSample,
        }).then(({ body }) => {
          areaofInterest = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/areaof-interests+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [areaofInterest],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(areaofInterestPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details AreaofInterest page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('areaofInterest');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', areaofInterestPageUrlPattern);
      });

      it('edit button click should load edit AreaofInterest page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('AreaofInterest');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', areaofInterestPageUrlPattern);
      });

      it('last delete button click should delete instance of AreaofInterest', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('areaofInterest').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', areaofInterestPageUrlPattern);

        areaofInterest = undefined;
      });
    });
  });

  describe('new AreaofInterest page', () => {
    beforeEach(() => {
      cy.visit(`${areaofInterestPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('AreaofInterest');
    });

    it('should create an instance of AreaofInterest', () => {
      cy.get(`[data-cy="intrestSummary"]`)
        .type('../fake-data/blob/hipster.txt')
        .invoke('val')
        .should('match', new RegExp('../fake-data/blob/hipster.txt'));

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        areaofInterest = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', areaofInterestPageUrlPattern);
    });
  });
});
