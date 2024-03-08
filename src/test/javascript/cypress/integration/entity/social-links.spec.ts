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

describe('SocialLinks e2e test', () => {
  const socialLinksPageUrl = '/social-links';
  const socialLinksPageUrlPattern = new RegExp('/social-links(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const socialLinksSample = {};

  let socialLinks: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/social-links+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/social-links').as('postEntityRequest');
    cy.intercept('DELETE', '/api/social-links/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (socialLinks) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/social-links/${socialLinks.id}`,
      }).then(() => {
        socialLinks = undefined;
      });
    }
  });

  it('SocialLinks menu should load SocialLinks page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('social-links');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('SocialLinks').should('exist');
    cy.url().should('match', socialLinksPageUrlPattern);
  });

  describe('SocialLinks page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(socialLinksPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create SocialLinks page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/social-links/new$'));
        cy.getEntityCreateUpdateHeading('SocialLinks');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', socialLinksPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/social-links',
          body: socialLinksSample,
        }).then(({ body }) => {
          socialLinks = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/social-links+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [socialLinks],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(socialLinksPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details SocialLinks page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('socialLinks');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', socialLinksPageUrlPattern);
      });

      it('edit button click should load edit SocialLinks page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('SocialLinks');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', socialLinksPageUrlPattern);
      });

      it('last delete button click should delete instance of SocialLinks', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('socialLinks').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', socialLinksPageUrlPattern);

        socialLinks = undefined;
      });
    });
  });

  describe('new SocialLinks page', () => {
    beforeEach(() => {
      cy.visit(`${socialLinksPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('SocialLinks');
    });

    it('should create an instance of SocialLinks', () => {
      cy.get(`[data-cy="lable"]`).type('Programmable XSS payment').should('have.value', 'Programmable XSS payment');

      cy.get(`[data-cy="link"]`).type('incubate').should('have.value', 'incubate');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        socialLinks = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', socialLinksPageUrlPattern);
    });
  });
});
