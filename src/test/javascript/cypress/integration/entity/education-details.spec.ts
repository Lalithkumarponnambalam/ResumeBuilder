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

describe('EducationDetails e2e test', () => {
  const educationDetailsPageUrl = '/education-details';
  const educationDetailsPageUrlPattern = new RegExp('/education-details(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const educationDetailsSample = { schoolName: 'Games' };

  let educationDetails: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/education-details+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/education-details').as('postEntityRequest');
    cy.intercept('DELETE', '/api/education-details/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (educationDetails) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/education-details/${educationDetails.id}`,
      }).then(() => {
        educationDetails = undefined;
      });
    }
  });

  it('EducationDetails menu should load EducationDetails page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('education-details');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('EducationDetails').should('exist');
    cy.url().should('match', educationDetailsPageUrlPattern);
  });

  describe('EducationDetails page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(educationDetailsPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create EducationDetails page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/education-details/new$'));
        cy.getEntityCreateUpdateHeading('EducationDetails');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', educationDetailsPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/education-details',
          body: educationDetailsSample,
        }).then(({ body }) => {
          educationDetails = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/education-details+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [educationDetails],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(educationDetailsPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details EducationDetails page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('educationDetails');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', educationDetailsPageUrlPattern);
      });

      it('edit button click should load edit EducationDetails page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('EducationDetails');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', educationDetailsPageUrlPattern);
      });

      it('last delete button click should delete instance of EducationDetails', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('educationDetails').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', educationDetailsPageUrlPattern);

        educationDetails = undefined;
      });
    });
  });

  describe('new EducationDetails page', () => {
    beforeEach(() => {
      cy.visit(`${educationDetailsPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('EducationDetails');
    });

    it('should create an instance of EducationDetails', () => {
      cy.get(`[data-cy="schoolName"]`).type('Frozen FTP').should('have.value', 'Frozen FTP');

      cy.get(`[data-cy="city"]`).type('North Briaburgh').should('have.value', 'North Briaburgh');

      cy.get(`[data-cy="state"]`).type('parse Metal').should('have.value', 'parse Metal');

      cy.get(`[data-cy="startDate"]`).type('2024-03-07').should('have.value', '2024-03-07');

      cy.get(`[data-cy="endDate"]`).type('2024-03-07').should('have.value', '2024-03-07');

      cy.get(`[data-cy="degree"]`).type('discrete').should('have.value', 'discrete');

      cy.get(`[data-cy="fieldofStudy"]`).type('Metal').should('have.value', 'Metal');

      cy.get(`[data-cy="graduationDate"]`).type('2024-03-08').should('have.value', '2024-03-08');

      cy.get(`[data-cy="educationSummary"]`)
        .type('../fake-data/blob/hipster.txt')
        .invoke('val')
        .should('match', new RegExp('../fake-data/blob/hipster.txt'));

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        educationDetails = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', educationDetailsPageUrlPattern);
    });
  });
});
