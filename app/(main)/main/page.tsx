import { FC } from "react";
import RentalPage from "./rental-page";
import { RentalItem, RentalPageData } from "@/app/types/rental-item";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth-options";

interface MainPageProps {}

const MainPage: FC<MainPageProps> = async ({}) => {
    const session = await getServerSession(authOptions);
    const response = await fetch(
        process.env.BACKEND_URL + "/rental-items/category/all?page=0&size=10",
        {
            method: "GET",
            cache: "no-cache",
            headers: {
                Authorization: `Bearer ${session?.user.id_token}`,
            },
        }
    );

    const data: RentalPageData = await response.json();
    console.log("RentalPageData ", data);
    return (
        <>
            <RentalPage rentalPageData={data} />
        </>
    );
};

export default MainPage;
