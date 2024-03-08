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

describe('Resume e2e test', () => {
  const resumePageUrl = '/resume';
  const resumePageUrlPattern = new RegExp('/resume(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const resumeSample = {};

  let resume: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/resumes+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/resumes').as('postEntityRequest');
    cy.intercept('DELETE', '/api/resumes/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (resume) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/resumes/${resume.id}`,
      }).then(() => {
        resume = undefined;
      });
    }
  });

  it('Resumes menu should load Resumes page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('resume');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Resume').should('exist');
    cy.url().should('match', resumePageUrlPattern);
  });

  describe('Resume page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(resumePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Resume page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/resume/new$'));
        cy.getEntityCreateUpdateHeading('Resume');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', resumePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/resumes',
          body: resumeSample,
        }).then(({ body }) => {
          resume = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/resumes+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [resume],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(resumePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Resume page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('resume');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', resumePageUrlPattern);
      });

      it('edit button click should load edit Resume page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Resume');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', resumePageUrlPattern);
      });

      it('last delete button click should delete instance of Resume', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('resume').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', resumePageUrlPattern);

        resume = undefined;
      });
    });
  });

  describe('new Resume page', () => {
    beforeEach(() => {
      cy.visit(`${resumePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Resume');
    });

    it('should create an instance of Resume', () => {
      cy.get(`[data-cy="resumeSummary"]`)
        .type('../fake-data/blob/hipster.txt')
        .invoke('val')
        .should('match', new RegExp('../fake-data/blob/hipster.txt'));

      cy.get(`[data-cy="jobTitle"]`).type('Dynamic Infrastructure Developer').should('have.value', 'Dynamic Infrastructure Developer');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        resume = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', resumePageUrlPattern);
    });
  });
});
