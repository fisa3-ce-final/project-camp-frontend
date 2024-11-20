"use client";

import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { CouponData, Coupon } from "@/app/types/admin-coupon";

interface CouponPageProps {
    couponData: CouponData;
    idToken: string;
}

const CouponPage: FC<CouponPageProps> = ({ couponData, idToken }) => {
    const [coupons, setCoupons] = useState(couponData.content);
    const [currentPage, setCurrentPage] = useState(couponData.number);
    const [totalPages, setTotalPages] = useState(couponData.totalPages);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newCoupon, setNewCoupon] = useState({
        name: "",
        type: "PERCENTAGE_DISCOUNT",
        discount: 0,
        amount: 0,
        expiryDate: "",
    });

    const fetchCoupons = async (page: number) => {
        try {
            const response = await fetch(
                `/backend/admin/coupon?page=${page}&size=10`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${idToken}`,
                    },
                    cache: "no-store",
                }
            );

            if (response.ok) {
                const data: CouponData = await response.json();
                setCoupons(data.content);
                setCurrentPage(data.number);
                setTotalPages(data.totalPages);
            } else {
                console.error("쿠폰 목록 갱신 실패");
            }
        } catch (error) {
            console.error("쿠폰 목록 가져오기 중 오류 발생:", error);
        }
    };

    const handlePageChange = (page: number) => {
        fetchCoupons(page);
    };

    const handleDeleteCoupon = async (couponId: number) => {
        try {
            const response = await fetch(`/backend/admin/coupon/${couponId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`,
                },
                cache: "no-store",
            });

            if (response.ok) {
                fetchCoupons(currentPage); // 목록 갱신
            } else {
                alert("쿠폰 삭제 실패. 다시 시도해주세요.");
            }
        } catch (error) {
            console.error("쿠폰 삭제 중 오류 발생:", error);
            alert("오류가 발생했습니다. 다시 시도해주세요.");
        }
    };

    const handleCreateCoupon = async () => {
        try {
            const response = await fetch("/backend/admin/coupon", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify(newCoupon),
            });

            if (response.ok) {
                setDialogOpen(false); // 다이얼로그 닫기
                fetchCoupons(currentPage); // 현재 페이지 목록 갱신
            } else {
                alert("쿠폰 생성 실패. 다시 시도해주세요.");
            }
        } catch (error) {
            console.error("쿠폰 생성 중 오류 발생:", error);
            alert("오류가 발생했습니다. 다시 시도해주세요.");
        }
    };

    const getDiscountWithUnit = (discount: number, type: string): string => {
        return type === "PERCENTAGE_DISCOUNT"
            ? `${discount}%`
            : `${discount}원`;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>쿠폰 관리</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex gap-5 mb-4">
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>쿠폰 생성</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>쿠폰 생성</DialogTitle>
                            </DialogHeader>
                            <div className="flex flex-col gap-4">
                                {/* 쿠폰 생성 폼 */}
                                <div>
                                    <label
                                        htmlFor="coupon-name"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        쿠폰 이름
                                    </label>
                                    <Input
                                        id="coupon-name"
                                        type="text"
                                        placeholder="쿠폰 이름"
                                        value={newCoupon.name}
                                        onChange={(e) =>
                                            setNewCoupon({
                                                ...newCoupon,
                                                name: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="coupon-type"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        할인 유형
                                    </label>
                                    <select
                                        id="coupon-type"
                                        value={newCoupon.type}
                                        onChange={(e) =>
                                            setNewCoupon({
                                                ...newCoupon,
                                                type: e.target.value,
                                            })
                                        }
                                        className="border rounded-md p-2 w-full"
                                    >
                                        <option value="PERCENTAGE_DISCOUNT">
                                            비율 할인
                                        </option>
                                        <option value="FIXED_AMOUNT_DISCOUNT">
                                            금액 할인
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label
                                        htmlFor="coupon-discount"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        할인율 또는 금액
                                    </label>
                                    <Input
                                        id="coupon-discount"
                                        type="number"
                                        placeholder="할인율 또는 금액"
                                        value={newCoupon.discount}
                                        onChange={(e) =>
                                            setNewCoupon({
                                                ...newCoupon,
                                                discount: parseFloat(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="coupon-amount"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        할당된 수량
                                    </label>
                                    <Input
                                        id="coupon-amount"
                                        type="number"
                                        placeholder="할당된 수량"
                                        value={newCoupon.amount}
                                        onChange={(e) =>
                                            setNewCoupon({
                                                ...newCoupon,
                                                amount: parseInt(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="coupon-expiry"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        만료일
                                    </label>
                                    <Input
                                        id="coupon-expiry"
                                        type="datetime-local"
                                        placeholder="만료일"
                                        value={newCoupon.expiryDate}
                                        onChange={(e) =>
                                            setNewCoupon({
                                                ...newCoupon,
                                                expiryDate: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreateCoupon}>
                                    생성
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>이름</TableHead>
                            <TableHead>수량</TableHead>
                            <TableHead>할인</TableHead>
                            <TableHead>타입</TableHead>
                            <TableHead>만료일</TableHead>
                            <TableHead>생성일</TableHead>
                            <TableHead>액션</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {coupons.map((coupon: Coupon) => (
                            <TableRow key={coupon.couponId}>
                                <TableCell>{coupon.name}</TableCell>
                                <TableCell>{coupon.amount}</TableCell>
                                <TableCell>
                                    {getDiscountWithUnit(
                                        coupon.discount,
                                        coupon.type
                                    )}
                                </TableCell>
                                <TableCell>
                                    {coupon.type === "PERCENTAGE_DISCOUNT"
                                        ? "비율 할인"
                                        : "금액 할인"}
                                </TableCell>
                                <TableCell>
                                    {new Date(
                                        coupon.expiryDate
                                    ).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    {new Date(
                                        coupon.createdAt
                                    ).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="destructive"
                                        onClick={() =>
                                            handleDeleteCoupon(coupon.couponId)
                                        }
                                    >
                                        삭제
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="mt-4 flex justify-between items-center">
                    <Button
                        onClick={() =>
                            handlePageChange(Math.max(0, currentPage - 1))
                        }
                        disabled={currentPage === 0}
                    >
                        이전
                    </Button>
                    <span>
                        현재 페이지: {currentPage + 1} / {totalPages}
                    </span>
                    <Button
                        onClick={() =>
                            handlePageChange(
                                Math.min(totalPages - 1, currentPage + 1)
                            )
                        }
                        disabled={currentPage === totalPages - 1}
                    >
                        다음
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default CouponPage;
