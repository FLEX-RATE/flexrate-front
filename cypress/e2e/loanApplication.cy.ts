describe('회원 로그인부터 대출 신청까지 전체 플로우', () => {
  before(() => {
    cy.intercept('POST', '/api/auth/login/password', {
      statusCode: 200,
      body: {
        accessToken: 'test-token',
        refreshToken: 'test-refresh-token',
      },
    }).as('loginRequest');

    cy.intercept('GET', '/api/members/loan-status', {
      statusCode: 200,
      body: 'NONE',
    }).as('loanStatus');

    cy.intercept('GET', '/api/members/credit-score-status', {
      statusCode: 200,
      body: { creditScoreStatus: false },
    }).as('creditScoreStatus');

    cy.intercept('GET', '/api/notification/unread-count', {
      statusCode: 200,
      body: { count: 0 },
    }).as('unreadCount');

    cy.intercept('POST', '/api/loans/1/select', {
      statusCode: 200,
      body: {},
    }).as('selectLoanProduct');

    cy.intercept('POST', '/api/auth/token', {
      statusCode: 200,
      body: { accessToken: 'test-token-refreshed' },
    });

    // 로그인
    cy.visit('/auth/login');
    cy.contains('일반 로그인').click();
    cy.get('input[placeholder="이메일 주소 입력"]').type('user1@example.com');
    cy.get('input[placeholder="비밀번호 입력"]').type('Test1234');
    cy.contains('로그인하기').click();
    cy.wait('@loginRequest');

    cy.window().then((win) => {
      win.localStorage.setItem(
        'user-storage',
        JSON.stringify({
          state: {
            accessToken: 'test-token',
            user: {
              username: '홍길동',
              role: 'MEMBER',
              email: 'user1@example.com',
              recentLoanStatus: 'NONE',
              hasCreditScore: false,
              creditScore: 0,
            },
            _hasHydrated: true,
          },
          version: 0,
        })
      );
    });

    cy.reload();
  });

  it('신용 점수 평가 및 대출 신청 전체 플로우', () => {
    // 홈 이동 → 대출 신청 → 평가 모달
    cy.visit('/');
    cy.contains('대출 신청하기').click();
    cy.contains('신용 점수 평가받기').should('exist').click();

    // 평가 플로우
    cy.url().should('include', '/credit-evaluation');
    cy.contains('전체 동의하기').click();
    cy.contains('동의하고 보기').click();
    cy.contains('님의 신용 점수를 산출했어요', { timeout: 5000 }).should('exist');

    // localStorage 상태 변경
    cy.window().then((win) => {
      const prev = JSON.parse(win.localStorage.getItem('user-storage') ?? '{}');
      win.localStorage.setItem(
        'user-storage',
        JSON.stringify({
          ...prev,
          state: {
            ...prev.state,
            user: {
              ...prev.state.user,
              hasCreditScore: true,
              creditScore: 400,
            },
          },
        })
      );
    });

    // 대출 신청으로 이동
    cy.contains('대출 신청하기').click();

    // 1단계: 직업 정보
    cy.get('[data-testid="type-accordion"]').click();
    cy.contains('아르바이트').click();
    cy.contains('다음으로').click();

    // 2단계: 신용 정보
    cy.get('input[placeholder="숫자만 입력"]').type('50000000');
    cy.contains('자가').click();
    cy.contains('아니오').click();
    cy.contains('다음으로').click();

    // 3단계: 대출 목적
    cy.get('[data-testid="type-accordion"]').click();
    cy.contains('생활비').click();
    cy.contains('다음으로').click();

    // 4단계: 신청 접수
    cy.get('input[placeholder="숫자만 입력하세요"]').type('10000000');
    cy.get('input[type="range"]').invoke('val', 12).trigger('input');
    cy.contains('전체 동의하기').click();
    cy.contains('대출 신청하기').click();

    // 완료 페이지
    cy.url().should('include', '/loan-result');
    cy.contains('대출 신청이 접수되었습니다').should('exist');
  });
});
