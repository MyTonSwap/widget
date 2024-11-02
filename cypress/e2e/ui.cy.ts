describe("setting ui components test", () => {
    beforeEach(() => {
        cy.visit(
            "http://127.0.0.1:6006/iframe.html?args=&globals=&id=components-swap--default&viewMode=story"
        );

        cy.get("[data-testid='setting-button']").click();
        cy.get("[data-testid='setting-popover']").should("be.visible");
        cy.get("[data-testid='slippage-setting']").should("be.visible");
    });

    it("slippage setting should work", () => {
        cy.get("[data-testid='slippage-indicator']").should(
            "contain.text",
            "Auto"
        );
        cy.get("[data-testid='slippage-setting-auto']").click();
        cy.get("[data-testid='slippage-setting-input']").should(
            "have.value",
            ""
        );
        cy.get("[data-testid='slippage-setting-plus']").click();
        cy.get("[data-testid='slippage-setting-input']").should(
            "have.value",
            "1"
        );
        cy.get("[data-testid='slippage-setting-auto']").click();
        cy.get("[data-testid='slippage-setting-input']").should(
            "have.value",
            ""
        );
    });
    it("community token setting should work", () => {
        cy.get("[data-testid='community-token-setting']").should("be.visible");
        cy.get("[data-testid='community-token-setting']").click();
        cy.get("[data-testid='community-token-setting']").click();
    });
});

describe("card input ui components test", () => {
    beforeEach(() => {
        cy.visit(
            "http://localhost:6006/iframe.html?args=&globals=&id=components-swap--default&viewMode=story"
        );
    });

    it("receive input should not change when receive token is not selected", () => {
        cy.get("[data-testid='swapcard-input-pay']").type("100");
        cy.get("[data-testid='swapcard-input-receive']").should(
            "have.value",
            "0"
        );
    });
    it("receive input should change when receive token is selected", () => {
        cy.get("[data-testid='card-button-receive']").click();
        cy.get("[data-testid='dialog-search-input']").type("STON");
        cy.get(
            "[data-testid='EQA2kCVNwVsil2EM2mB0SkXytxCqQjS4mttjDpnXmwG9T6bO']"
        ).click();
        cy.get("[data-testid='swapcard-input-pay']").type("100");
        cy.get("[data-testid='swapcard-input-receive']").should("not.be", "0");
    });
    it("should change direction when swap button is clicked", () => {
        cy.get("[data-testid='card-button-receive']").click();
        cy.get("[data-testid='dialog-search-input']").type("STON");
        cy.get(
            "[data-testid='EQA2kCVNwVsil2EM2mB0SkXytxCqQjS4mttjDpnXmwG9T6bO']"
        ).click();
        cy.get("[data-testid='swapcard-input-pay']").type("100");
        // wait for a second
        cy.wait(1000);

        // cy.get("[data-testid='swap-details']").click();
        cy.get("[data-testid='change-direction-button']").click();
        cy.get("[data-testid='swapcard-input-pay']").should("have.text", "");
    });
    it("input should change to zero when pay token changes", () => {
        cy.get("[data-testid='swapcard-input-pay']").type("100");
        cy.get("[data-testid='card-button-receive']").click();
        cy.get("[data-testid='dialog-search-input']").type("STON");
        cy.get(
            "[data-testid='EQA2kCVNwVsil2EM2mB0SkXytxCqQjS4mttjDpnXmwG9T6bO']"
        ).click();
        cy.get("[data-testid='swapcard-input-pay']").should("have.text", "");
        cy.get("[data-testid='card-button-pay']").click();
        cy.get("[data-testid='dialog-search-input']").type("SCALE");
        cy.get(
            "[data-testid='EQBlqsm144Dq6SjbPI4jjZvA1hqTIP3CvHovbIfW_t-SCALE']"
        ).click();
        cy.get("[data-testid='swapcard-input-pay']").should("have.text", "");
    });
    it("should show 'token not found' when an invalid token is searched", () => {
        cy.get("[data-testid='card-button-receive']").click();
        cy.get("[data-testid='dialog-search-input']").type("INVALIDTOKEN");
        cy.get("[data-testid='token-not-found']").should("be.visible");
    });
});
