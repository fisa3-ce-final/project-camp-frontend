import { FC } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";
import MyItemsPage from "./my-items-page";

const MyRentalItems: FC = async () => {
    const session = await getServerSession(authOptions);

    return <MyItemsPage />;
};

export default MyRentalItems;
