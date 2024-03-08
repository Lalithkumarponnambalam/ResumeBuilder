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

describe('ExperienceDetails e2e test', () => {
  const experienceDetailsPageUrl = '/experience-details';
  const experienceDetailsPageUrlPattern = new RegExp('/experience-details(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const experienceDetailsSample = {};

  let experienceDetails: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/experience-details+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/experience-details').as('postEntityRequest');
    cy.intercept('DELETE', '/api/experience-details/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (experienceDetails) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/experience-details/${experienceDetails.id}`,
      }).then(() => {
        experienceDetails = undefined;
      });
    }
  });

  it('ExperienceDetails menu should load ExperienceDetails page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('experience-details');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('ExperienceDetails').should('exist');
    cy.url().should('match', experienceDetailsPageUrlPattern);
  });

  describe('ExperienceDetails page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(experienceDetailsPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create ExperienceDetails page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/experience-details/new$'));
        cy.getEntityCreateUpdateHeading('ExperienceDetails');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', experienceDetailsPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/experience-details',
          body: experienceDetailsSample,
        }).then(({ body }) => {
          experienceDetails = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/experience-details+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [experienceDetails],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(experienceDetailsPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details ExperienceDetails page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('experienceDetails');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', experienceDetailsPageUrlPattern);
      });

      it('edit button click should load edit ExperienceDetails page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ExperienceDetails');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', experienceDetailsPageUrlPattern);
      });

      it('last delete button click should delete instance of ExperienceDetails', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('experienceDetails').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', experienceDetailsPageUrlPattern);

        experienceDetails = undefined;
      });
    });
  });

  describe('new ExperienceDetails page', () => {
    beforeEach(() => {
      cy.visit(`${experienceDetailsPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('ExperienceDetails');
    });

    it('should create an instance of ExperienceDetails', () => {
      cy.get(`[data-cy="positionTitle"]`).type('Koruna').should('have.value', 'Koruna');

      cy.get(`[data-cy="companyName"]`).type('Table').should('have.value', 'Table');

      cy.get(`[data-cy="startDate"]`).type('2024-03-08').should('have.value', '2024-03-08');

      cy.get(`[data-cy="endDate"]`).type('2024-03-08').should('have.value', '2024-03-08');

      cy.get(`[data-cy="workSummary"]`)
        .type('../fake-data/blob/hipster.txt')
        .invoke('val')
        .should('match', new RegExp('../fake-data/blob/hipster.txt'));

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        experienceDetails = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', experienceDetailsPageUrlPattern);
    });
  });
});
