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

describe('KeySkills e2e test', () => {
  const keySkillsPageUrl = '/key-skills';
  const keySkillsPageUrlPattern = new RegExp('/key-skills(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const keySkillsSample = {};

  let keySkills: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/key-skills+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/key-skills').as('postEntityRequest');
    cy.intercept('DELETE', '/api/key-skills/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (keySkills) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/key-skills/${keySkills.id}`,
      }).then(() => {
        keySkills = undefined;
      });
    }
  });

  it('KeySkills menu should load KeySkills page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('key-skills');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('KeySkills').should('exist');
    cy.url().should('match', keySkillsPageUrlPattern);
  });

  describe('KeySkills page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(keySkillsPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create KeySkills page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/key-skills/new$'));
        cy.getEntityCreateUpdateHeading('KeySkills');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', keySkillsPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/key-skills',
          body: keySkillsSample,
        }).then(({ body }) => {
          keySkills = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/key-skills+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [keySkills],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(keySkillsPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details KeySkills page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('keySkills');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', keySkillsPageUrlPattern);
      });

      it('edit button click should load edit KeySkills page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('KeySkills');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', keySkillsPageUrlPattern);
      });

      it('last delete button click should delete instance of KeySkills', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('keySkills').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', keySkillsPageUrlPattern);

        keySkills = undefined;
      });
    });
  });

  describe('new KeySkills page', () => {
    beforeEach(() => {
      cy.visit(`${keySkillsPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('KeySkills');
    });

    it('should create an instance of KeySkills', () => {
      cy.get(`[data-cy="keySkillsSummary"]`)
        .type('../fake-data/blob/hipster.txt')
        .invoke('val')
        .should('match', new RegExp('../fake-data/blob/hipster.txt'));

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        keySkills = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', keySkillsPageUrlPattern);
    });
  });
});
