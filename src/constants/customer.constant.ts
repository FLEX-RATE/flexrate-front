// 소비 성향 라벨 매핑
export const CONSUMPTION_TYPE_LABEL_MAP: Record<string, string> = {
  CONSERVATIVE: '절약형',
  PRACTICAL: '실용형',
  BALANCED: '균형형',
  CONSUMPTION_ORIENTED: '일반형',
};

// 소비 목표 라벨 매핑
export const CONSUME_GOAL_LABEL_MAP: Record<string, string> = {
  NO_SPENDING_TODAY: '오늘 하루, 지출 없이 보내고싶어요.',
  LIMIT_DAILY_MEAL: '하루 식비로 10,000원 이상 쓰고싶지 않아요.',
  SAVE_70_PERCENT: '수입 70% 이상을 저축해요.',
  INCOME_OVER_EXPENSE: '지출보다 수익이 많아요.',
  ONLY_PUBLIC_TRANSPORT: '대중교통만 이용해요.',
  COMPARE_BEFORE_BUYING: '구매하기 전에 가격을 비교해요.',
  HAS_HOUSING_SAVING: '주택청약을 들고 있어요.',
  CLOTHING_UNDER_100K: '10만원 이하의 의류를 소비해요.',
  ONE_CATEGORY_SPEND: '오늘은 하나의 카테고리에만 소비해보세요.',
  SMALL_MONTHLY_SAVE: '매달 소액의 저축을 목표로 해요.',
  NO_USELESS_ELECTRONICS: '필요하지 않은 가전제품은 구매하지 않아요.',
  OVER_10_PERCENT: '평균 지출의 10% 이상 소비해요.',
  NO_EXPENSIVE_DESSERT: '만원을 넘기는 디저트와 커피는 사치에요.',
  NO_OVER_50K_PER_DAY: '하루에 5만원 이상의 무리한 소비는 하지 않아요.',
  SUBSCRIPTION_UNDER_50K: '월 구독비로 5만원을 넘기지 않아요.',
  MEAL_UNDER_20K: '2만원이 넘는 밥값은 소비하지 않는 편이에요.',
};

// 성별 라벨 매핑
export const SEX_LABEL_MAP: Record<string, string> = {
  MALE: '남',
  FEMALE: '여',
};

// 상태 라벨 매핑
export const MEMBERSTATUS_LABEL_MAP: Record<string, string> = {
  ACTIVE: '활성화',
  WITHDRAWN: '탈퇴',
  SUSPENDED: '이용정지',
};
