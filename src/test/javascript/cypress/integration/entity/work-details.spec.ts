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

describe('WorkDetails e2e test', () => {
  const workDetailsPageUrl = '/work-details';
  const workDetailsPageUrlPattern = new RegExp('/work-details(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const workDetailsSample = { jobTitle: 'Future Tactics Coordinator' };

  let workDetails: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/work-details+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/work-details').as('postEntityRequest');
    cy.intercept('DELETE', '/api/work-details/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (workDetails) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/work-details/${workDetails.id}`,
      }).then(() => {
        workDetails = undefined;
      });
    }
  });

  it('WorkDetails menu should load WorkDetails page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('work-details');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('WorkDetails').should('exist');
    cy.url().should('match', workDetailsPageUrlPattern);
  });

  describe('WorkDetails page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(workDetailsPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create WorkDetails page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/work-details/new$'));
        cy.getEntityCreateUpdateHeading('WorkDetails');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', workDetailsPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/work-details',
          body: workDetailsSample,
        }).then(({ body }) => {
          workDetails = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/work-details+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [workDetails],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(workDetailsPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details WorkDetails page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('workDetails');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', workDetailsPageUrlPattern);
      });

      it('edit button click should load edit WorkDetails page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('WorkDetails');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', workDetailsPageUrlPattern);
      });

      it('last delete button click should delete instance of WorkDetails', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('workDetails').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', workDetailsPageUrlPattern);

        workDetails = undefined;
      });
    });
  });

  describe('new WorkDetails page', () => {
    beforeEach(() => {
      cy.visit(`${workDetailsPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('WorkDetails');
    });

    it('should create an instance of WorkDetails', () => {
      cy.get(`[data-cy="jobTitle"]`).type('Legacy Applications Officer').should('have.value', 'Legacy Applications Officer');

      cy.get(`[data-cy="position"]`).type('Ergonomic bandwidth').should('have.value', 'Ergonomic bandwidth');

      cy.get(`[data-cy="companyName"]`).type('Frozen Architect').should('have.value', 'Frozen Architect');

      cy.get(`[data-cy="city"]`).type('Alpharetta').should('have.value', 'Alpharetta');

      cy.get(`[data-cy="state"]`).type('Car').should('have.value', 'Car');

      cy.get(`[data-cy="startDate"]`).type('2024-03-07').should('have.value', '2024-03-07');

      cy.get(`[data-cy="endDate"]`).type('2024-03-08').should('have.value', '2024-03-08');

      cy.get(`[data-cy="workSummary"]`)
        .type('../fake-data/blob/hipster.txt')
        .invoke('val')
        .should('match', new RegExp('../fake-data/blob/hipster.txt'));

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        workDetails = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', workDetailsPageUrlPattern);
    });
  });
});
