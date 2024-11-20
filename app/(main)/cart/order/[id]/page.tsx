import { FC } from "react";
import CartOrderPage from "./order-page";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";

interface PageProps {}

const OrderServerPage: FC<PageProps> = async ({}) => {
    const session = await getServerSession(authOptions);

    return (
        <div>
            <CartOrderPage idToken={session?.user.id_token!} />
        </div>
    );
};

export default OrderServerPage;
