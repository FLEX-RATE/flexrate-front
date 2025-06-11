describe('회원가입 플로우 테스트', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/auth/email/verification', {
      statusCode: 200,
      body: { success: true },
    }).as('verifyEmailCode');

    cy.intercept('GET', '/api/auth/consumption-type', {
      statusCode: 200,
      body: {
        consumptionType: 'CONSERVATIVE',
      },
    }).as('getConsumptionType');

    cy.visit('/auth/signup');
  });

  it('사용자가 모든 단계를 완료하고 회원가입을 마친다', () => {
    cy.get('input[type="email"]').type('user2@example.com');
    cy.contains('인증요청하기').click();

    cy.get('input[placeholder="인증번호 입력"]').type('123456');
    cy.contains('인증하기').click();

    cy.wait('@verifyEmailCode');

    cy.get('input[placeholder="비밀번호 입력"]').type('Test1234');
    cy.get('input[placeholder="비밀번호 확인"]').type('Test1234');
    cy.contains('다음으로').click();

    const pin = ['1', '2', '3', '4', '5', '6'];

    pin.forEach((num) => {
      cy.contains('button', num).click({ force: true });
      cy.wait(50);
    });

    pin.forEach((num) => {
      cy.contains(num).click();
      cy.wait(50);
    });

    cy.contains('여성', { timeout: 10000 }).should('be.visible').click();
    cy.get('input[placeholder="생년월일 (예: 19990101)"]').type('19990101');
    cy.get('input[placeholder="이름 입력"]').type('홍길동');
    cy.contains('다음으로').click();

    cy.contains('전체 동의하기').click();
    cy.contains('다음으로').click();

    cy.wait('@getConsumptionType');
    cy.contains('님의 소비 성향은', { timeout: 10000 }).should('exist');

    cy.wait(3500);

    cy.contains('다음으로', { timeout: 5000 }).should('be.visible').click({ force: true });

    cy.contains('소비 목표를 골라주세요', { timeout: 10000 }).should('exist');

    cy.get('button').eq(1).click();

    cy.contains('다음으로').should('not.be.disabled').click({ force: true });
  });
});
