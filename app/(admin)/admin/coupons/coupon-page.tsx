"use client";

import { FC, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { Trash2, Plus, ChevronLeft, ChevronRight } from "lucide-react";

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
                    cache: "no-cache",
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
                cache: "no-cache",
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

    const tableVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const tableRowVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br min-h-screen"
        >
            <Card className="w-full max-w-6xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-primary">
                        쿠폰 관리
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-5 mb-6">
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-primary text-white hover:bg-primary-dark transition-colors duration-300">
                                    <Plus className="mr-2 h-4 w-4" /> 쿠폰 생성
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>쿠폰 생성</DialogTitle>
                                </DialogHeader>
                                <div className="flex flex-col gap-4 py-4">
                                    <div className="flex flex-col gap-2">
                                        <label
                                            htmlFor="coupon-name"
                                            className="text-sm font-medium text-gray-700"
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
                                    <div className="flex flex-col gap-2">
                                        <label
                                            htmlFor="coupon-type"
                                            className="text-sm font-medium text-gray-700"
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
                                    <div className="flex flex-col gap-2">
                                        <label
                                            htmlFor="coupon-discount"
                                            className="text-sm font-medium text-gray-700"
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
                                    <div className="flex flex-col gap-2">
                                        <label
                                            htmlFor="coupon-amount"
                                            className="text-sm font-medium text-gray-700"
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
                                    <div className="flex flex-col gap-2">
                                        <label
                                            htmlFor="coupon-expiry"
                                            className="text-sm font-medium text-gray-700"
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
                                    <Button
                                        onClick={handleCreateCoupon}
                                        className="bg-primary text-white hover:bg-primary-dark transition-colors duration-300"
                                    >
                                        생성
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <motion.div
                        variants={tableVariants}
                        initial="hidden"
                        animate="show"
                    >
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
                                <AnimatePresence>
                                    {coupons.map((coupon: Coupon) => (
                                        <motion.tr
                                            key={coupon.couponId}
                                            variants={tableRowVariants}
                                            initial="hidden"
                                            animate="show"
                                            exit="hidden"
                                            layout
                                        >
                                            <TableCell>{coupon.name}</TableCell>
                                            <TableCell>
                                                {coupon.amount}
                                            </TableCell>
                                            <TableCell>
                                                {getDiscountWithUnit(
                                                    coupon.discount,
                                                    coupon.type
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {coupon.type ===
                                                "PERCENTAGE_DISCOUNT"
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
                                                        handleDeleteCoupon(
                                                            coupon.couponId
                                                        )
                                                    }
                                                    className="bg-red-500 hover:bg-red-600 transition-colors duration-300"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </TableBody>
                        </Table>
                    </motion.div>
                    <motion.div
                        className="mt-6 flex justify-between items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Button
                            onClick={() =>
                                handlePageChange(Math.max(0, currentPage - 1))
                            }
                            disabled={currentPage === 0}
                            className="flex items-center transition-all duration-300 hover:bg-primary hover:text-white"
                        >
                            <ChevronLeft className="mr-2 h-4 w-4" /> 이전
                        </Button>
                        <span className="text-sm font-medium">
                            현재 페이지: {currentPage + 1} / {totalPages}
                        </span>
                        <Button
                            onClick={() =>
                                handlePageChange(
                                    Math.min(totalPages - 1, currentPage + 1)
                                )
                            }
                            disabled={currentPage === totalPages - 1}
                            className="flex items-center transition-all duration-300 hover:bg-primary hover:text-white"
                        >
                            다음 <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </motion.div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default CouponPage;
