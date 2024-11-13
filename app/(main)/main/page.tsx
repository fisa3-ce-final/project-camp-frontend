import { FC } from "react";
import RentalPage from "./rental-page";

interface MainPageProps {}

const MainPage: FC<MainPageProps> = async ({}) => {
    return (
        <>
            <RentalPage />
        </>
    );
};

export default MainPage;
