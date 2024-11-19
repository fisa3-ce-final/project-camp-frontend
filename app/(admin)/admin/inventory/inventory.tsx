"use client";

import { FC, useState } from "react";
import { RentalItem } from "@/app/types/admin-rental";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { categoryMapEngToKor } from "@/app/types/category-map";
import { Badge } from "@/components/ui/badge";

interface InventoryClientProps {
    initialData: RentalItem[];
    totalPages: number;
    idToken: string;
}

const InventoryClient: FC<InventoryClientProps> = ({
    initialData,
    totalPages,
    idToken,
}) => {
    const [rentalItems, setRentalItems] = useState<RentalItem[]>(initialData);
    const [page, setPage] = useState(0);

    const handleFetchPage = async (newPage: number) => {
        try {
            const res = await fetch(
                `/backend/admin/rental-items?status=ALL&page=${newPage}&size=10`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${idToken}`,
                    },
                    cache: "no-cache",
                }
            );

            if (!res.ok) throw new Error("Failed to fetch new page data");

            const data: { content: RentalItem[] } = await res.json();
            setRentalItems(data.content);
            setPage(newPage);
        } catch (error) {
            console.error("Error fetching page data:", error);
        }
    };

    const handleStatusUpdate = async (id: number, status: string) => {
        try {
            const res = await fetch(
                `/backend/admin/rental-items/${id}?status=${status}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${idToken}`,
                    },
                    cache: "no-cache",
                }
            );

            if (!res.ok)
                throw new Error(`Failed to update status for item ${id}`);

            console.log(`Item ${id} status updated to ${status}`);
            handleFetchPage(page); // Refresh the current page
        } catch (error) {
            console.error(`Error updating status for item ${id}:`, error);
        }
    };

    return (
        <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rentalItems.map((item) => (
                    <Card
                        key={item.rentalItemId}
                        className="border rounded-lg shadow-sm"
                    >
                        <CardHeader>
                            <CardTitle>{item.name}</CardTitle>
                            <CardDescription>
                                {categoryMapEngToKor[item.category]}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>가격: {item.price.toFixed(2)} 원 </p>
                            상태:
                            {/* AVAILABE, PENDING, REJECTED  */}
                            <Badge
                                className={
                                    item.status === "AVAILABLE"
                                        ? "bg-green-600"
                                        : item.status === "PENDING"
                                        ? "bg-yellow-600"
                                        : "bg-red-600"
                                }
                            >
                                {item.status}
                            </Badge>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button
                                variant="outline"
                                onClick={() =>
                                    handleStatusUpdate(
                                        item.rentalItemId,
                                        "AVAILABLE"
                                    )
                                }
                            >
                                승인
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() =>
                                    handleStatusUpdate(
                                        item.rentalItemId,
                                        "REJECTED"
                                    )
                                }
                            >
                                반려
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
            <div className="flex justify-between items-center mt-4">
                <Button
                    onClick={() => handleFetchPage(page - 1)}
                    disabled={page === 0}
                    variant="outline"
                >
                    Previous
                </Button>
                <p>
                    Page {page + 1} of {totalPages}
                </p>
                <Button
                    onClick={() => handleFetchPage(page + 1)}
                    disabled={page === totalPages - 1}
                    variant="outline"
                >
                    Next
                </Button>
            </div>
        </div>
    );
};

export default InventoryClient;
