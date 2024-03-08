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

describe('Internship e2e test', () => {
  const internshipPageUrl = '/internship';
  const internshipPageUrlPattern = new RegExp('/internship(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const internshipSample = {};

  let internship: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/internships+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/internships').as('postEntityRequest');
    cy.intercept('DELETE', '/api/internships/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (internship) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/internships/${internship.id}`,
      }).then(() => {
        internship = undefined;
      });
    }
  });

  it('Internships menu should load Internships page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('internship');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Internship').should('exist');
    cy.url().should('match', internshipPageUrlPattern);
  });

  describe('Internship page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(internshipPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Internship page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/internship/new$'));
        cy.getEntityCreateUpdateHeading('Internship');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', internshipPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/internships',
          body: internshipSample,
        }).then(({ body }) => {
          internship = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/internships+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [internship],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(internshipPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Internship page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('internship');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', internshipPageUrlPattern);
      });

      it('edit button click should load edit Internship page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Internship');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', internshipPageUrlPattern);
      });

      it('last delete button click should delete instance of Internship', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('internship').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', internshipPageUrlPattern);

        internship = undefined;
      });
    });
  });

  describe('new Internship page', () => {
    beforeEach(() => {
      cy.visit(`${internshipPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Internship');
    });

    it('should create an instance of Internship', () => {
      cy.get(`[data-cy="jobTitle"]`).type('Central Implementation Executive').should('have.value', 'Central Implementation Executive');

      cy.get(`[data-cy="employer"]`).type('harness deploy Grocery').should('have.value', 'harness deploy Grocery');

      cy.get(`[data-cy="companyName"]`).type('Incredible').should('have.value', 'Incredible');

      cy.get(`[data-cy="address"]`).type('Washington').should('have.value', 'Washington');

      cy.get(`[data-cy="startDate"]`).type('2024-03-07').should('have.value', '2024-03-07');

      cy.get(`[data-cy="endDate"]`).type('2024-03-08').should('have.value', '2024-03-08');

      cy.get(`[data-cy="internshipSummary"]`)
        .type('../fake-data/blob/hipster.txt')
        .invoke('val')
        .should('match', new RegExp('../fake-data/blob/hipster.txt'));

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        internship = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', internshipPageUrlPattern);
    });
  });
});
