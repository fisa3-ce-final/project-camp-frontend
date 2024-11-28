"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, ShoppingCart, Tag } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CartPageData, PendingOrder } from "@/app/types/cart-data";
import { format, differenceInCalendarDays } from "date-fns";
import { ko } from "date-fns/locale";
import { categoryMapEngToKor } from "@/app/types/category-map";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CartList = ({ idToken }: { idToken: string }) => {
    const [cartData, setCartData] = useState<CartPageData | null>(null);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [date, setDate] = useState<{ from: Date; to: Date }>({
        from: new Date(),
        to: new Date(new Date().setDate(new Date().getDate() + 3)),
    });
    const [selectedCoupon, setSelectedCoupon] = useState<string | null>(null);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const checkPendingOrder = async () => {
        try {
            const response = await fetch("/backend/orders/pending", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`,
                },
                cache: "no-cache",
            });

            if (response.ok) {
                const data: PendingOrder[] = await response.json();
                if (data.length > 0 && data[0].orderStatus === "PENDING") {
                    router.push(`/cart/order/${data[0].id}`);
                    return;
                }
            } else {
                console.error(
                    "Failed to fetch pending orders:",
                    response.statusText
                );
            }
        } catch (error: any) {
            console.error("Error fetching pending orders:", error);
            toast.error("주문 정보를 불러오는 데 실패했습니다.");
        }

        await fetchCartData();
        setIsLoading(false);
    };

    const fetchCartData = async () => {
        try {
            const response = await fetch("/backend/cart-items", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`,
                },
                cache: "no-cache",
            });

            if (!response.ok) throw new Error("Failed to fetch cart data");

            const data: CartPageData = await response.json();
            setCartData(data);
            setSelectedItems(data.cartItems.map((item) => item.id));
        } catch (error) {
            console.error("Error fetching cart data:", error);
        }
    };

    useEffect(() => {
        checkPendingOrder();
    }, [idToken, router]);

    const handleSelectItem = (id: number) => {
        setSelectedItems((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );
    };

    const getRentalDays = (): number => {
        const { from, to } = date;
        return differenceInCalendarDays(to, from) + 1;
    };

    const calculateTotal = () => {
        if (!cartData) return 0;

        const rentalDays = getRentalDays();

        return Math.floor(
            selectedItems.reduce((total, id) => {
                const item = cartData.cartItems.find((item) => item.id === id);
                return (
                    total +
                    (item?.rentalItem.price || 0) * (item?.quantity || 0)
                );
            }, 0) * rentalDays
        );
    };

    const calculateDiscount = () => {
        if (!selectedCoupon || !cartData) return 0;

        const coupon = cartData.coupons.find(
            (coupon) => coupon.couponId.toString() === selectedCoupon
        );

        if (!coupon) return 0;

        const rentalDays = getRentalDays();

        if (coupon.type === "FIXED_AMOUNT_DISCOUNT") {
            return Math.floor(coupon.discount);
        }

        if (coupon.type === "PERCENTAGE_DISCOUNT") {
            return Math.floor((calculateTotal() * coupon.discount) / 100);
        }

        return 0;
    };

    const calculateFinalTotal = () => {
        return Math.floor(calculateTotal() - calculateDiscount());
    };

    const handleApplyRental = async () => {
        if (selectedItems.length === 0) {
            console.warn("선택된 장바구니 항목이 없습니다.");
            toast.error("장바구니 항목을 선택해주세요.");
            return;
        }
        const rentalDateISO = new Date(
            new Date(date.from.setHours(0, 0, 0, 0)).getTime() +
                9 * 60 * 60 * 1000
        ).toISOString();
        const returnDateISO = new Date(
            new Date(date.to.setHours(0, 0, 0, 0)).getTime() +
                9 * 60 * 60 * 1000
        ).toISOString();

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

        try {
            const response = await fetch("/backend/orders/reserve", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "예약에 실패했습니다.");
            }

            const result = await response.json();
            console.log("예약 성공:", result);
            toast.success("대여 신청이 완료되었습니다!");

            router.push(`/cart/order/${result.orderId}`);
        } catch (error: any) {
            console.error("예약 신청 오류:", error);
            toast.error(`대여 신청에 실패했습니다: ${error.message}`);
        }
    };
    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <Skeleton className="h-10 w-1/3 mb-6" />
                <div className="grid md:grid-cols-3 gap-6">
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
                    <Skeleton className="h-[400px] w-full rounded-lg" />
                </div>
            </div>
        );
    }

    if (!cartData || cartData.cartItems.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-4xl mx-auto p-4 text-center"
            >
                <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h1 className="text-2xl font-bold mb-2">
                    장바구니가 비어있습니다
                </h1>
                <p className="text-gray-600 mb-4">
                    상품을 둘러보고 장바구니에 담아보세요!
                </p>
                <Button onClick={() => router.push("/main")}>
                    상품 둘러보기
                </Button>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto p-4"
        >
            <h1 className="text-3xl font-bold mb-6">장바구니 🛒</h1>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                    {cartData.cartItems.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="hover:shadow-md transition-shadow">
                                <CardContent className="flex items-center p-4">
                                    <Checkbox
                                        checked={selectedItems.includes(
                                            item.id
                                        )}
                                        onCheckedChange={() =>
                                            handleSelectItem(item.id)
                                        }
                                        className="mr-4"
                                    />
                                    <img
                                        src={
                                            item.rentalItem.image[0]
                                                ?.imageUrl ||
                                            "/placeholder_rental_image.jpg"
                                        }
                                        alt={item.rentalItem.name}
                                        className="w-20 h-20 object-cover rounded mr-4"
                                    />
                                    <div className="flex-grow">
                                        <h3 className="font-medium">
                                            {item.rentalItem.name}
                                        </h3>
                                        <p className="text-sm text-gray-600">
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
                                        <p className="text-sm text-gray-600">
                                            수량: {item.quantity}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>대여 요약 📋</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">
                                    대여 기간 📅 (총 {getRentalDays()}일)
                                </label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full h-[50px] justify-start text-left font-normal mt-1"
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date.from && date.to ? (
                                                <>
                                                    {format(date.from, "PPP", {
                                                        locale: ko,
                                                    })}{" "}
                                                    ~<br />
                                                    {format(date.to, "PPP", {
                                                        locale: ko,
                                                    })}
                                                </>
                                            ) : (
                                                "날짜를 선택하세요"
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="range"
                                            selected={date}
                                            onSelect={(range) => {
                                                if (range && range.from) {
                                                    setDate({
                                                        from: range.from,
                                                        to:
                                                            range.to ||
                                                            range.from,
                                                    });
                                                }
                                            }}
                                            locale={ko}
                                            disabled={{ before: new Date() }}
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
                        </CardContent>
                    </Card>
                    <Button
                        className="w-full"
                        size="lg"
                        onClick={handleApplyRental}
                    >
                        대여 신청하기 ✨
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default CartList;
