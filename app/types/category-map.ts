// 카테고리 한글명과 영어 상태값 맵핑
export const categoryMap: { [key: string]: string } = {
    전체: "ALL",
    텐트: "TENT",
    배낭: "BACKPACK",
    "취사 도구": "COOKWARE",
    침낭: "SLEEPING_BAG",
    "캠핑 가구": "CAMPING_FURNITURE",
    조명: "LIGHTING",
};

// 영어 상태값을 한글로 변환하는 매핑
export const categoryMapEngToKor: { [key: string]: string } = {
    ALL: "전체",
    TENT: "텐트",
    BACKPACK: "배낭",
    COOKWARE: "취사 도구",
    SLEEPING_BAG: "침낭",
    CAMPING_FURNITURE: "캠핑 가구",
    LIGHTING: "조명",
};

export const statusMapping: { [key: string]: string } = {
    PENDING: "심사 중",
    AVAILABLE: "심사 완료",
    REJECTED: "심사 거부", // 새로운 상태 추가
};

// 배지 색상 매핑 추가 예시
export const statusColorMapping: { [key: string]: string } = {
    PENDING: "yellow",
    AVAILABLE: "green",
    REJECTED: "red", // 새로운 상태에 대한 색상 추가
};
