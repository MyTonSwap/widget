describe("setting ui components test", () => {
    beforeEach(() => {
        cy.visit(
            "http://localhost:6006/iframe.html?args=&globals=&id=components-swap--default&viewMode=story"
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
        cy.get("[data-testid='slippage-setting-2']").click();
        cy.get("[data-testid='slippage-setting-input']").should(
            "have.value",
            "2"
        );
        cy.get("[data-testid='slippage-setting-auto']").click();
        cy.get("[data-testid='slippage-setting-input']").should(
            "have.value",
            ""
        );
        cy.get("[data-testid='slippage-setting-5']").click();
        cy.get("[data-testid='slippage-setting-input']").should(
            "have.value",
            "5"
        );
        cy.get("[data-testid='slippage-setting-auto']").click();
        cy.get("[data-testid='slippage-setting-input']").should(
            "have.value",
            ""
        );

        cy.get("[data-testid='slippage-setting-input']").type("10");
        cy.get("[data-testid='slippage-indicator']").should(
            "contain.text",
            "10"
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

describe("i18n ui components test", () => {
    it("should change language russian version is opened", () => {
        cy.visit(
            "http://localhost:6006/iframe.html?args=&globals=&id=components-swap--russian&viewMode=story"
        );
        cy.get("[data-testid='swap-header-title']").should(
            "contain.text",
            "Обмен"
        );
        cy.get("[data-testid='swapcard-title']").should(
            "contain.text",
            "Вы платите"
        );
        cy.get("[data-testid='swapcard-title']").should(
            "contain.text",
            "Вы получаете"
        );
        cy.get("[data-testid='swap-button']").should(
            "have.text",
            "Подключить кошелек"
        );
    });
    it("should change language arabic version is opened", () => {
        cy.visit(
            "http://localhost:6006/iframe.html?args=&globals=&id=components-swap--arabic"
        );
        cy.get("[data-testid='swap-header-title']").should(
            "contain.text",
            "تبادل"
        );
        cy.get("[data-testid='swapcard-title']").should(
            "contain.text",
            "أنت تدفع"
        );
        cy.get("[data-testid='swapcard-title']").should(
            "contain.text",
            "أنت تستلم"
        );
        cy.get("[data-testid='swap-button']").should(
            "have.text",
            "توصيل المحفظة"
        );
    });
    it("should change language arabic version is opened", () => {
        cy.visit(
            "http://localhost:6006/iframe.html?args=&globals=&id=components-swap--spanish"
        );
        cy.get("[data-testid='swap-header-title']").should(
            "contain.text",
            "Intercambiar"
        );
        cy.get("[data-testid='swapcard-title']").should(
            "contain.text",
            "Usted paga"
        );
        cy.get("[data-testid='swapcard-title']").should(
            "contain.text",
            "Usted recibe"
        );
        cy.get("[data-testid='swap-button']").should(
            "have.text",
            "Conectar billetera"
        );
    });
});

describe("locked input tests", () => {
    it("should not change pay input when locked", () => {
        cy.visit(
            "http://localhost:6006/iframe.html?args=&globals=&id=components-swap--with-locked-token"
        );
        cy.get("[data-testid='card-button-pay']").should(
            "contain.text",
            "HYDRA"
        );
        cy.get("[data-testid='card-button-pay']").should("be.disabled");
        cy.get("[data-testid='change-direction-button']").should("be.disabled");
    });
    it("should not change pay input when locked", () => {
        cy.visit(
            "http://localhost:6006/iframe.html?args=&globals=&id=components-swap--with-locked-input"
        );
        cy.get("[data-testid='card-button-receive']").should(
            "contain.text",
            "TON"
        );
        cy.get("[data-testid='card-button-receive']").should("be.disabled");
        cy.get("[data-testid='swapcard-input-pay']").should("be.disabled");
        cy.get("[data-testid='change-direction-button']").should("be.disabled");
    });
});

describe("refresh hide option tests", () => {
    it("should not be visible", () => {
        cy.visit(
            "http://localhost:6006/iframe.html?globals=&args=&id=components-swap--without-refresh&viewMode=story"
        );
        cy.get("[data-testid='refresh-button']").should("not.exist");
    });
});
