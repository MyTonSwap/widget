describe('swap tests', () => {
    beforeEach(() => {
        cy.visit(
            'http://localhost:6006/iframe.html?args=&globals=&id=components-swap--default&viewMode=story'
        );
    });
    it('should be able to swap ston with right dex', () => {
        cy.get("[data-testid='card-button-receive']").click();
        cy.get("[data-testid='dialog-search-input']").type('STON');
        cy.get(
            "[data-testid='EQA2kCVNwVsil2EM2mB0SkXytxCqQjS4mttjDpnXmwG9T6bO']"
        ).click();
        cy.get("[data-testid='swapcard-input-pay']").type('100');
        cy.get("[data-testid='swap-details']").click();
        cy.get("[data-testid='dex-container']").should(
            'contain.text',
            'StonFi'
        );
    });
    it('should be able to swap scale with right dex', () => {
        cy.get("[data-testid='card-button-receive']").click();
        cy.get("[data-testid='dialog-search-input']").type('SCALE');
        cy.get(
            "[data-testid='EQBlqsm144Dq6SjbPI4jjZvA1hqTIP3CvHovbIfW_t-SCALE']"
        ).click();
        cy.get("[data-testid='swapcard-input-pay']").type('100');
        cy.get("[data-testid='swap-details']").click();
        cy.get("[data-testid='dex-container']").should(
            'contain.text',
            'Dedust'
        );
    });
    it('output should get price impact when input amount is too high', () => {
        cy.get("[data-testid='card-button-receive']").click();
        cy.get("[data-testid='dialog-search-input']").type('SCALE');
        cy.get(
            "[data-testid='EQBlqsm144Dq6SjbPI4jjZvA1hqTIP3CvHovbIfW_t-SCALE']"
        ).click();
        cy.get("[data-testid='swapcard-input-pay']").type('10000');
        cy.get("[data-testid='swap-details']").click();
        cy.wait(1000);
        cy.get("[data-testid='price-impact']")
            .invoke('text')
            .then((text) => {
                const impact = parseFloat(text.replace('%', ''));
                expect(impact).to.be.greaterThan(90);
            });
    });
});
