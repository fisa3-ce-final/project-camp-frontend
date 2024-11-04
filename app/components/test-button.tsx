"use client";
import { Button } from "@/components/ui/button";
import { FC } from "react";
import { toast } from "sonner";

interface TestButtonProps {}

const TestButton: FC<TestButtonProps> = async ({}) => {
    return (
        <div>
            <Button
                onClick={() => {
                    toast(
                        <>
                            <pre>
                                <code>hello world</code>
                            </pre>
                        </>
                    );
                }}
            >
                hello world
            </Button>
        </div>
    );
};

export default TestButton;
