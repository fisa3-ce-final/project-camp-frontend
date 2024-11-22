import { FC } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import MyItemsPage from "./my-items-page";

interface MyRentalItemsProps {
    idToken: string;
}

const MyRentalItems: FC<MyRentalItemsProps> = async ({ idToken }) => {
    const session = await getServerSession(authOptions);

    return <MyItemsPage idToken={session?.user.id_token!} />;
};

export default MyRentalItems;
