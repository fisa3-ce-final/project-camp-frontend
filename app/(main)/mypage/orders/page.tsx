import { FC } from "react";
import MyOrdersPage from "./my-orders-page";
import { OrderPageData } from "@/app/types/order-data";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";

interface MyOrdersProps {}

const MyOrders: FC<MyOrdersProps> = async ({}) => {
    const session = await getServerSession(authOptions);

    const response = await fetch(
        process.env.BACKEND_URL + "/rental-items/my-orders?page=0&size=10",
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.user.id_token}`,
            },
            cache: "no-store",
        }
    );

    const data: OrderPageData = await response.json();

    return (
        <>
            <MyOrdersPage
                orderPageData={data}
                idToken={session?.user.id_token!}
            />
        </>
    );
};

export default MyOrders;
