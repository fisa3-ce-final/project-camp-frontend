import { FC } from "react";
import MyOrdersPage from "./my-orders-page";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";

interface MyOrdersProps {}

const MyOrders: FC<MyOrdersProps> = async () => {
    const session = await getServerSession(authOptions);

    return <MyOrdersPage />;
};

export default MyOrders;
