"use client";

import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Minus, Plus, Trash2 } from "lucide-react";
import { CartPageData } from "@/app/types/cart-data";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { categoryMapEngToKor } from "@/app/types/category-map";

interface CartListProps {
    cartPageData: CartPageData;
    idToken: string;
}

export default function Component({ cartPageData, idToken }: CartListProps) {
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [date, setDate] = useState<{ from: Date; to: Date }>({
        from: new Date(),
        to: new Date(new Date().setDate(new Date().getDate() + 3)),
    });
    const [showCoupons, setShowCoupons] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState<string | undefined>(
        undefined
    );

    // 예시 쿠폰 데이터
    const availableCoupons = [
        { id: 1, name: "신규 가입 할인", discount: 3000 },
        { id: 2, name: "주말 특별 할인", discount: 5000 },
        { id: 3, name: "첫 구매 할인", discount: 2000 },
    ];

    const handleSelectItem = (id: number) => {
        setSelectedItems((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );
    };

    const calculateTotal = () => {
        return selectedItems.reduce((total, id) => {
            const item = cartPageData.cartItems.find((item) => item.id === id);
            return (
                total + (item?.rentalItem.price || 0) * (item?.quantity || 0)
            );
        }, 0);
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">장바구니 🛒</h1>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                    {cartPageData.cartItems.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between border rounded-lg p-4 hover:shadow-md transition-shadow"
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
                                        {item.rentalItem.price.toLocaleString()}
                                        원/일
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => {
                                            /* 수량 감소 로직 */
                                        }}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="w-8 text-center">
                                        {item.quantity}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => {
                                            /* 수량 증가 로직 */
                                        }}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive"
                                    onClick={() => {
                                        /* 삭제 로직 */
                                    }}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-6">
                    <div className="border rounded-lg p-4">
                        <h2 className="font-semibold mb-4">대여 요약 📋</h2>

                        <div className="space-y-4 ">
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
                                            <div className="flex flex-col items-start text-wrap">
                                                <span className="text-xs text-muted-foreground">
                                                    대여 기간
                                                </span>
                                                {date.from ? (
                                                    date.to ? (
                                                        <>
                                                            {format(
                                                                date.from,
                                                                "PPP",
                                                                { locale: ko }
                                                            )}{" "}
                                                            <br />-{" "}
                                                            {format(
                                                                date.to,
                                                                "PPP",
                                                                { locale: ko }
                                                            )}
                                                        </>
                                                    ) : (
                                                        format(
                                                            date.from,
                                                            "PPP",
                                                            { locale: ko }
                                                        )
                                                    )
                                                ) : (
                                                    <span>
                                                        날짜를 선택하세요
                                                    </span>
                                                )}
                                            </div>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto p-0"
                                        align="start"
                                    >
                                        <Calendar
                                            initialFocus
                                            mode="range"
                                            defaultMonth={date.from}
                                            selected={{
                                                from: date.from,
                                                to: date.to,
                                            }}
                                            onSelect={(range) =>
                                                range &&
                                                setDate({
                                                    from:
                                                        range.from ||
                                                        new Date(),
                                                    to: range.to || new Date(),
                                                })
                                            }
                                            locale={ko}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div>
                                <label className="text-sm font-medium">
                                    쿠폰 선택 🎫
                                </label>
                                <Select
                                    onValueChange={setSelectedCoupon}
                                    value={selectedCoupon}
                                >
                                    <SelectTrigger className="w-full mt-1">
                                        <SelectValue placeholder="쿠폰을 선택하세요" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableCoupons.map((coupon) => (
                                            <SelectItem
                                                key={coupon.id}
                                                value={coupon.id.toString()}
                                            >
                                                {coupon.name} (
                                                {coupon.discount.toLocaleString()}
                                                원 할인)
                                            </SelectItem>
                                        ))}
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
                                        -
                                        {(selectedCoupon
                                            ? availableCoupons.find(
                                                  (c) =>
                                                      c.id.toString() ===
                                                      selectedCoupon
                                              )?.discount || 0
                                            : 0
                                        ).toLocaleString()}
                                        원
                                    </span>
                                </div>
                                <div className="flex justify-between font-bold text-lg">
                                    <span>결제 예정금액</span>
                                    <span>
                                        {(
                                            calculateTotal() -
                                            (selectedCoupon
                                                ? availableCoupons.find(
                                                      (c) =>
                                                          c.id.toString() ===
                                                          selectedCoupon
                                                  )?.discount || 0
                                                : 0)
                                        ).toLocaleString()}
                                        원
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Button className="w-full" size="lg">
                        대여 신청하기 ✨
                    </Button>
                </div>
            </div>
        </div>
    );
}
