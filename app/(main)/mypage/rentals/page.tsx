import { authOptions } from "@/app/lib/auth-options";
import { getServerSession } from "next-auth";
import { FC } from "react";
import MyRentalsPage from "./my-rentals-page";

interface RentalsServerPageProps {}

const RentalsServerPage: FC<RentalsServerPageProps> = async ({}) => {
    const session = await getServerSession(authOptions);

    return <MyRentalsPage idToken={session?.user.id_token!} />;
};

export default RentalsServerPage;
