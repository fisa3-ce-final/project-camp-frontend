import { FC } from "react";
import { CartItem, CartPageData } from "@/app/types/cart-data";
import CartList from "./cart-list";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";

interface CartPageProps {}

const CartPage: FC<CartPageProps> = async () => {
    const session = await getServerSession(authOptions);

    // const response = await fetch(process.env.BACKEND_URL + "/cart-items", {
    //     method: "GET",
    //     headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${session?.user.id_token}`,
    //     },
    //     cache: "no-store",
    // });

    // const data: CartPageData = await response.json();

    return (
        <div>
            <CartList idToken={session?.user.id_token!} />
        </div>
    );
};

export default CartPage;
