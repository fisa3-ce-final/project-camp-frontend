import { FC } from "react";
import RentalList from "./rental-list";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";

interface RentalsPageProps {}

const RentalsPage: FC<RentalsPageProps> = async ({}) => {
    const session = await getServerSession(authOptions);

    return (
        <div>
            <RentalList idToken={session?.user.id_token!} />
        </div>
    );
};

export default RentalsPage;
