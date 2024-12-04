
"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getQueryClient } from "@/app/lib/get-query-client";

const extractOriginalOrderId = (paddedOrderId) => {
    return parseInt(paddedOrderId.replace('ORDER-', ''));
};

export default function SuccessComponent({ idToken }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryClient = getQueryClient();

    useEffect(() => {
        const paddedOrderId = searchParams.get("orderId");
        const originalOrderId = extractOriginalOrderId(paddedOrderId);
        // 1. URL에서 결제 정보 파라미터 추출
        const requestData = {
            orderId: originalOrderId,
            amount: searchParams.get("amount"),
            paymentKey: searchParams.get("paymentKey"),
        };

        // 2. 결제 확인 함수 정의
        async function confirm() {
            // 3. 토큰 유효성 검사
            if (!idToken) {
                console.error("No ID token available");
                router.push("/orders/fail?message=인증 정보가 없습니다");
                return;
            }

            // 4. 백엔드로 결제 확인 요청
            const response = await fetch("/backend/orders/confirm", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify(requestData),
            });

            // 5. 응답 처리
            const json = await response.json();
            console.log("Payment confirmation response:", json);
        }

        // 6. orderId가 존재할 경우에만 확인 프로세스 시작
        if (searchParams.get("orderId")) {
            confirm();
        }
        //2초 후에 메인 페이지로 이동
        setTimeout(() => {
            queryClient.invalidateQueries({
                queryKey: ["cartQuantity"],
            });
            router.push("/main");
        }, 2000);
    }, [searchParams, router, idToken]); // 의존성 배열: 이 값들이 변경될 때마다 useEffect 실행

    // 7. 결제 성공 UI 렌더링
    return (
        <div className="result wrapper">
            <div className="box_section">
                <h2>결제 성공</h2>
                <p>{`주문번호: ${searchParams.get("orderId")}`}</p>
                <p>{`결제 금액: ${Number(
                    searchParams.get("amount")
                ).toLocaleString()}원`}</p>
            </div>
        </div>
    );
}