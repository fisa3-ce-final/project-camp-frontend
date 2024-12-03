// app/rental/[id]/page.tsx
import { FC } from "react";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import { RentalItemDetail } from "@/app/types/rental-item";
import ItemDetail from "./item-detail";

interface ItemDetailPageProps {
    params: {
        id: string;
    };
}
const ItemDetailPage: FC<ItemDetailPageProps> = async ({ params }) => {
    const session = await getServerSession(authOptions);

    const detailResponse = await fetch(
        process.env.BACKEND_URL + `/rental-items/${params.id}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.user.id_token}`,
            },
            cache: "no-cache",
        }
    );

    const itemDetail: RentalItemDetail = await detailResponse.json();

    const viewsResponse = await fetch(
        process.env.BACKEND_URL + `/rental-items/${params.id}/views`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.user.id_token}`,
            },
            cache: "no-cache",
        }
    );

    const viewsData = await viewsResponse.text;

    return (
        <div>
            <ItemDetail 
                itemDetail={itemDetail}
                idToken={session?.user.id_token!} 
            />
        </div>
    );
};


export default ItemDetailPage;
