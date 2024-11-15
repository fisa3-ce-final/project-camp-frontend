// types/UserGetResponse.ts
export interface UserGetResponse {
    uuid: string;
    username: string;
    email: string;
    phone: string;
    address: string;
    nickname: string;
    imageUrl: string;
    provider: string;
    createdAt: string; // LocalDateTime을 문자열로 변환
}
