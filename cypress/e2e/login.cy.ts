describe('로그인 플로우 테스트', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/auth/login/password', {
      statusCode: 200,
      body: {
        accessToken: 'fake-access-token',
        refreshToken: 'fake-refresh-token',
      },
    }).as('loginRequest');

    cy.intercept('GET', '/api/members/loan-status', {
      statusCode: 200,
      body: {},
    });

    cy.intercept('GET', '/api/members/credit-score-status', {
      statusCode: 200,
      body: {},
    });

    cy.intercept('GET', '/api/notification/unread-count', {
      statusCode: 200,
      body: { count: 0 },
    }).as('unreadCount');

    cy.visit('/auth/login');

    cy.contains('일반 로그인').click();
  });

  it('유효한 이메일과 비밀번호로 로그인 성공', () => {
    cy.get('input[placeholder="이메일 주소 입력"]').type('newuser@example.com');
    cy.get('input[placeholder="비밀번호 입력"]', { timeout: 3000 }).should('exist');

    cy.get('input[placeholder="비밀번호 입력"]').type('Test1234');

    cy.contains('로그인하기').click();
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);

    cy.window().then((win) => {
      win.localStorage.setItem('accessToken', 'fake-access-token');
    });

    cy.intercept('GET', '/api/members/credit-score-status', { statusCode: 200, body: {} });
    cy.intercept('GET', '/api/members/loan-status', { statusCode: 200, body: {} });
    cy.intercept('POST', '/api/auth/token', {
      statusCode: 200,
      body: {
        accessToken: 'fake-access-token',
        refreshToken: 'fake-refresh-token',
      },
    });

    cy.url().should('include', '/');
  });
});
