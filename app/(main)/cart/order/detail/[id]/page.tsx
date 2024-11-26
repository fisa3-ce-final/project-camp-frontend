import { FC } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import OrderDetailPage from "./order-detail-page";

interface OrderDetailServerPageProps {}

const OrderDetailServerPage: FC<OrderDetailServerPageProps> = async () => {
    const session = await getServerSession(authOptions);

    // const response = await fetch(process.env.BACKEND_URL + "/cart-items", {
    //     method: "GET",
    //     headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${session?.user.id_token}`,
    //     },
    //     cache: "no-store",
    // });

    // const data: OrderDetailServerPageData = await response.json();

    return (
        <div>
            <OrderDetailPage idToken={session?.user.id_token!} />
        </div>
    );
};

export default OrderDetailServerPage;
