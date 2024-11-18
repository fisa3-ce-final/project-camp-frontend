import { FC } from "react";
import Inventory from "./inventory";
import {} from "@/app/types/rental-item";
import { RentalItemsResponse } from "@/app/types/admin-rental";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";

const InventoryPage: FC = async () => {
    const res = await fetch(
        `${process.env.BACKEND_URL}/admin/rental-items?status=ALL&page=0&size=10`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-cache",
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch inventory data");
    }

    const data: RentalItemsResponse = await res.json();
    const session = await getServerSession(authOptions);

    return (
        <div>
            <Inventory
                initialData={data.content}
                totalPages={data.totalPages}
                idToken={session?.user.id_token!}
            />
        </div>
    );
};

export default InventoryPage;
