"use client";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";

const CheckoutPage = ({ idToken }) => {
    const [amount, setAmount] = useState({
        currency: "KRW",
        value: 0,
    });
    const [ready, setReady] = useState(false);
    const [widgets, setWidgets] = useState(null);
    const [customerKey, setCustomerKey] = useState(null);
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [paymentWidget, setPaymentWidget] = useState(null);
    const [agreementWidget, setAgreementWidget] = useState(null);

    useEffect(() => {
        async function fetchInitialData() {
            try {
                // UUID 가져오기
                const uuidResponse = await fetch("/backend/user/uuid", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${idToken}`,
                    },
                });

                if (!uuidResponse.ok) {
                    throw new Error("UUID 요청 실패");
                }

                const { uuid } = await uuidResponse.json();
                setCustomerKey(uuid);

                // 주문 금액 가져오기
                const amountResponse = await fetch("/backend/orders/amount", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${idToken}`,
                    },
                });

                if (!amountResponse.ok) {
                    throw new Error("주문 금액 요청 실패");
                }

                const amountData = await amountResponse.json();
                setAmount((prev) => ({
                    ...prev,
                    value: parseInt(amountData),
                }));

                // 주문 정보 가져오기
                const paymentInfoResponse = await fetch(
                    "/backend/orders/paymentInfo",
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${idToken}`,
                        },
                        cache: "no-cache",
                    }
                );

                if (!paymentInfoResponse.ok) {
                    throw new Error("주문 정보 요청 실패");
                }

                const paymentInfoData = await paymentInfoResponse.json();
                setPaymentInfo(paymentInfoData);

                // Toss Payments 위젯 초기화
                const tossPayments = await loadTossPayments(clientKey);
                const widgets = tossPayments.widgets({
                    customerKey: uuid,
                });
                setWidgets(widgets);
            } catch (error) {
                console.error("초기 데이터 로딩 에러:", error);
            }
        }

        fetchInitialData();
    }, [idToken]);

    useEffect(() => {
        async function renderPaymentWidgets() {
            if (widgets == null) {
                return;
            }
            if (amount.value === 0) {
                return;
            }

            await widgets.setAmount(amount);

            const newPaymentWidget = await widgets.renderPaymentMethods({
                selector: "#payment-method",
                variantKey: "DEFAULT",
            });
            const newAgreementWidget = await widgets.renderAgreement({
                selector: "#agreement",
                variantKey: "AGREEMENT",
            });

            setPaymentWidget(newPaymentWidget);
            setAgreementWidget(newAgreementWidget);
            setReady(true);
        }

        renderPaymentWidgets();

        return () => {
            if (paymentWidget) {
                console.log("destroying payment widget");
                paymentWidget.destroy();
            }
            if (agreementWidget) {
                agreementWidget.destroy();
            }
        };
    }, [widgets, amount]);

    const saveAmount = async () => {
        try {
            const response = await fetch("/backend/orders/saveAmount", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify({
                    orderId: paymentInfo.orderId,
                    amount: amount.value,
                }),
            });

            if (!response.ok) {
                throw new Error("금액 저장 실패");
            }

            return true;
        } catch (error) {
            console.error("금액 저장 에러:", error);
            return false;
        }
    };

    return (
        <div className="wrapper">
            <div className="box_section">
                <div id="payment-method" />
                <div id="agreement" />

                <div className="flex flex-col items-center w-full justify-center p-5 gap-5">
                    <Button
                        className="w-full bg-blue-500 h-12"
                        disabled={!ready || !paymentInfo}
                        onClick={async () => {
                            try {
                                console.log(customerKey);
                                // 결제 요청 전 금액 저장
                                const saveSuccess = await saveAmount();
                                if (!saveSuccess) {
                                    alert("결제 정보 저장에 실패했습니다.");
                                    return;
                                }

                                await widgets.requestPayment({
                                    orderId: paymentInfo.orderId.toString(),
                                    orderName: paymentInfo.orderName,
                                    successUrl:
                                        window.location.origin +
                                        "/cart/order/success",
                                    failUrl:
                                        window.location.origin +
                                        "/cart/order/fail",
                                    customerEmail: paymentInfo.customerEmail,
                                    customerName: paymentInfo.customerName,
                                    customerMobilePhone:
                                        paymentInfo.customerMobilePhone,
                                });
                            } catch (error) {
                                console.error(error);
                            }
                        }}
                    >
                        결제하기
                    </Button>
                    <Button
                        onClick={() => {
                            window.location.href = "/cart";
                        }}
                        className="bg-red-500 w-full  h-12"
                    >
                        취소하기
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
