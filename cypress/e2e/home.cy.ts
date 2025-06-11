describe('Home 페이지 렌더링 시나리오', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Hydration 되지 않은 경우 CharacterLoading을 보여준다', () => {
    cy.window().then((win) => {
      win.localStorage.clear();
    });
    cy.visit('/');
    cy.get('[data-testid="character-loading"]').should('exist');
  });

  it('로그인 안 된 사용자는 IntroduceHome을 본다', () => {
    cy.window().then((win) => {
      win.localStorage.setItem(
        'user-store',
        JSON.stringify({ state: { _hasHydrated: true, user: null } })
      );
    });
    cy.visit('/');
    cy.get('[data-testid="introduce-home"]').should('exist');
  });

  it('로그인한 사용자가 대출을 보유 중이면 MainHasLoan을 본다', () => {
    cy.window().then((win) => {
      win.localStorage.setItem(
        'user-store',
        JSON.stringify({
          state: {
            _hasHydrated: true,
            user: {
              recentLoanStatus: 'EXECUTED',
              username: '테스터',
              role: 'MEMBER',
              email: 'test@user.com',
            },
          },
        })
      );
    });
    cy.visit('/');
    cy.get('[data-testid="main-has-loan"]').should('exist');
  });

  it('로그인한 사용자가 대출 미보유 시 IntroduceHome을 본다', () => {
    cy.window().then((win) => {
      win.localStorage.setItem(
        'user-store',
        JSON.stringify({
          state: {
            _hasHydrated: true,
            user: {
              recentLoanStatus: 'PENDING',
              username: '대기중',
              role: 'MEMBER',
              email: 'wait@user.com',
            },
          },
        })
      );
    });
    cy.visit('/');
    cy.get('[data-testid="introduce-home"]').should('exist');
  });
});
