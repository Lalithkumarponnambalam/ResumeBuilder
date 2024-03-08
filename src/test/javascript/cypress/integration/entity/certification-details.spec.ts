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

describe('CertificationDetails e2e test', () => {
  const certificationDetailsPageUrl = '/certification-details';
  const certificationDetailsPageUrlPattern = new RegExp('/certification-details(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const certificationDetailsSample = {};

  let certificationDetails: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/certification-details+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/certification-details').as('postEntityRequest');
    cy.intercept('DELETE', '/api/certification-details/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (certificationDetails) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/certification-details/${certificationDetails.id}`,
      }).then(() => {
        certificationDetails = undefined;
      });
    }
  });

  it('CertificationDetails menu should load CertificationDetails page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('certification-details');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('CertificationDetails').should('exist');
    cy.url().should('match', certificationDetailsPageUrlPattern);
  });

  describe('CertificationDetails page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(certificationDetailsPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create CertificationDetails page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/certification-details/new$'));
        cy.getEntityCreateUpdateHeading('CertificationDetails');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', certificationDetailsPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/certification-details',
          body: certificationDetailsSample,
        }).then(({ body }) => {
          certificationDetails = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/certification-details+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [certificationDetails],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(certificationDetailsPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details CertificationDetails page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('certificationDetails');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', certificationDetailsPageUrlPattern);
      });

      it('edit button click should load edit CertificationDetails page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('CertificationDetails');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', certificationDetailsPageUrlPattern);
      });

      it('last delete button click should delete instance of CertificationDetails', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('certificationDetails').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', certificationDetailsPageUrlPattern);

        certificationDetails = undefined;
      });
    });
  });

  describe('new CertificationDetails page', () => {
    beforeEach(() => {
      cy.visit(`${certificationDetailsPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('CertificationDetails');
    });

    it('should create an instance of CertificationDetails', () => {
      cy.get(`[data-cy="certificateName"]`).type('Orchestrator Account').should('have.value', 'Orchestrator Account');

      cy.get(`[data-cy="institution"]`).type('matrix').should('have.value', 'matrix');

      cy.get(`[data-cy="certificateDate"]`).type('2024-03-07').should('have.value', '2024-03-07');

      cy.get(`[data-cy="certificationSummary"]`)
        .type('../fake-data/blob/hipster.txt')
        .invoke('val')
        .should('match', new RegExp('../fake-data/blob/hipster.txt'));

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        certificationDetails = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', certificationDetailsPageUrlPattern);
    });
  });
});
