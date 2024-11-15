import { FC } from "react";
import RentalPage from "./rental-page";
import { RentalItem, RentalPageData } from "@/app/types/rental-item";

interface MainPageProps {}

const MainPage: FC<MainPageProps> = async ({}) => {
    const response = await fetch(
        process.env.BACKEND_URL + "/rental-items/category/all?page=0&size=10",
        {
            method: "GET",
            cache: "no-cache",
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
