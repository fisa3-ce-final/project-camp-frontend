// components/CartList.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"; // Re-added Checkbox import
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react"; // Removed Minus, Plus, Trash2 imports
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CartPageData } from "@/app/types/cart-data";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { categoryMapEngToKor } from "@/app/types/category-map";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const CartList = ({ idToken }: { idToken: string }) => {
    const [cartData, setCartData] = useState<CartPageData | null>(null);
    const [selectedItems, setSelectedItems] = useState<number[]>([]); // Re-added selection state
    const [date, setDate] = useState<{ from: Date; to: Date }>({
        from: new Date(),
        to: new Date(new Date().setDate(new Date().getDate() + 3)),
    });
    const [selectedCoupon, setSelectedCoupon] = useState<string | null>(null);

    // 데이터 Fetch
    const fetchCartData = async () => {
        try {
            const response = await fetch("/backend/cart-items", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`,
                },
                cache: "no-store",
            });

            if (!response.ok) throw new Error("Failed to fetch cart data");

            const data: CartPageData = await response.json();
            setCartData(data);
            // Set all items as selected by default (optional)
            setSelectedItems(data.cartItems.map((item) => item.id));
        } catch (error) {
            console.error("Error fetching cart data:", error);
        }
    };

    useEffect(() => {
        fetchCartData();
    }, []);

    // Re-added handleSelectItem function
    const handleSelectItem = (id: number) => {
        setSelectedItems((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );
    };
    const calculateTotal = () => {
        if (!cartData) return 0;

        return Math.floor(
            selectedItems.reduce((total, id) => {
                const item = cartData.cartItems.find((item) => item.id === id);
                return (
                    total +
                    (item?.rentalItem.price || 0) * (item?.quantity || 0)
                );
            }, 0)
        );
    };

    const calculateDiscount = () => {
        if (!selectedCoupon || !cartData) return 0;

        const coupon = cartData.coupons.find(
            (coupon) => coupon.couponId.toString() === selectedCoupon
        );

        if (!coupon) return 0;

        if (coupon.type === "FIXED_AMOUNT_DISCOUNT") {
            return Math.floor(coupon.discount); // 고정 금액 할인
        }

        if (coupon.type === "PERCENTAGE_DISCOUNT") {
            return Math.floor((calculateTotal() * coupon.discount) / 100); // 퍼센트 할인
        }

        return 0;
    };
    const calculateFinalTotal = () => {
        return Math.floor(calculateTotal() - calculateDiscount());
    };

    // 대여 신청하기 버튼 클릭 핸들러
    const handleApplyRental = () => {
        if (selectedItems.length === 0) {
            toast.error("선택된 장바구니 항목이 없습니다.");
            return;
        }

        const rentalDateISO = date.from.toISOString();
        const returnDateISO = date.to.toISOString();

        const payload: {
            cartItemIds: number[];
            rentalDate: string;
            returnDate: string;
            userCouponId?: number;
        } = {
            cartItemIds: selectedItems,
            rentalDate: rentalDateISO,
            returnDate: returnDateISO,
        };

        if (selectedCoupon) {
            payload.userCouponId = parseInt(selectedCoupon, 10);
        }

        console.log(
            "백엔드로 전송할 데이터:",
            JSON.stringify(payload, null, 2)
        );
    };

    if (!cartData) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                {/* 제목 스켈레톤 */}
                <Skeleton className="h-10 w-1/3 mb-6" />

                <div className="grid md:grid-cols-3 gap-6">
                    {/* 장바구니 항목 스켈레톤 */}
                    <div className="md:col-span-2 space-y-4">
                        {Array(3)
                            .fill(null)
                            .map((_, index) => (
                                <Skeleton
                                    key={index}
                                    className="h-24 w-full rounded-lg"
                                />
                            ))}
                    </div>

                    {/* 요약 정보 스켈레톤 */}
                    <div className="space-y-6">
                        <Skeleton className="h-40 w-full rounded-lg" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">장바구니 🛒</h1>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                    {cartData.cartItems.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between border rounded-lg p-4 hover:shadow-md transition-shadow"
                            onClick={() => {
                                handleSelectItem(item.id);
                            }}
                        >
                            <div className="flex items-center space-x-4">
                                <Checkbox
                                    checked={selectedItems.includes(item.id)}
                                    onCheckedChange={() =>
                                        handleSelectItem(item.id)
                                    }
                                />
                                <img
                                    src={
                                        item.rentalItem.image[0]?.imageUrl ||
                                        "https://images.unsplash.com/photo-1544077960-604201fe74bc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1651&q=80"
                                    }
                                    alt={item.rentalItem.name}
                                    className="w-20 h-20 object-cover rounded"
                                />
                                <div>
                                    <p className="font-medium">
                                        {item.rentalItem.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {
                                            categoryMapEngToKor[
                                                item.rentalItem.category
                                            ]
                                        }
                                    </p>
                                    <p className="font-semibold">
                                        {item.rentalItem.price.toLocaleString()}{" "}
                                        원/일
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        수량: {item.quantity}
                                    </p>{" "}
                                    {/* Display quantity as read-only */}
                                </div>
                            </div>
                            {/* Removed quantity buttons and trash button */}
                        </div>
                    ))}
                </div>

                <div className="space-y-6">
                    <div className="border rounded-lg p-4">
                        <h2 className="font-semibold mb-4">대여 요약 📋</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">
                                    대여 기간 📅
                                </label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start text-left font-normal mt-1  h-[70px]"
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            <div>
                                                {date.from && date.to ? (
                                                    <>
                                                        {format(
                                                            date.from,
                                                            "PPP",
                                                            { locale: ko }
                                                        )}{" "}
                                                        ~
                                                        <br />
                                                        {format(
                                                            date.to,
                                                            "PPP",
                                                            {
                                                                locale: ko,
                                                            }
                                                        )}
                                                    </>
                                                ) : (
                                                    "날짜를 선택하세요"
                                                )}
                                            </div>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <Calendar
                                            mode="range"
                                            selected={date}
                                            onSelect={(range) => {
                                                if (
                                                    range &&
                                                    range.from &&
                                                    range.to
                                                ) {
                                                    setDate({
                                                        from: range.from,
                                                        to: range.to,
                                                    });
                                                }
                                            }}
                                            locale={ko}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div>
                                <label className="text-sm font-medium">
                                    쿠폰 선택 🎫
                                </label>
                                <Select onValueChange={setSelectedCoupon}>
                                    <SelectTrigger className="w-full mt-1">
                                        <SelectValue placeholder="쿠폰을 선택하세요" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={null!}>
                                            선택 안 함
                                        </SelectItem>
                                        {cartData.coupons.map(
                                            (coupon, index) => (
                                                <SelectItem
                                                    key={`${coupon.couponId}-${index}`}
                                                    value={coupon.couponId.toString()}
                                                >
                                                    {coupon.name}
                                                </SelectItem>
                                            )
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex justify-between mb-2">
                                    <span>총 상품금액</span>
                                    <span>
                                        {calculateTotal().toLocaleString()}원
                                    </span>
                                </div>
                                <div className="flex justify-between mb-2 text-primary">
                                    <span>쿠폰 할인</span>
                                    <span>
                                        -{calculateDiscount().toLocaleString()}
                                        원
                                    </span>
                                </div>
                                <div className="flex justify-between font-bold text-lg">
                                    <span>결제 예정금액</span>
                                    <span>
                                        {calculateFinalTotal().toLocaleString()}
                                        원
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button
                        className="w-full"
                        size="lg"
                        onClick={handleApplyRental} // 클릭 핸들러 연결
                    >
                        대여 신청하기 ✨
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CartList;
