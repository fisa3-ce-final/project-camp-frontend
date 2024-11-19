"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    FileInput,
    FileUploader,
    FileUploaderContent,
    FileUploaderItem,
} from "@/components/ui/file-upload";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { categoryMap } from "@/app/types/category-map";
import { useSession } from "next-auth/react";

const formSchema = z.object({
    name: z.string().nonempty("물품 이름을 입력해주세요."),
    description: z.string(),
    price: z.coerce.number().min(0, "가격은 0 이상이어야 합니다."),
    stock: z.coerce.number().int().min(1, "수량은 1 이상이어야 합니다."),
    category: z.string().nonempty("카테고리를 선택해주세요."),
    images: z.array(z.instanceof(File)),
});

export default function CampingItemForm() {
    const [files, setFiles] = useState<File[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const router = useRouter();
    const session = useSession();

    const dropZoneConfig = {
        maxFiles: 5,
        maxSize: 1024 * 1024 * 4,
        multiple: true,
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            stock: 1,
            category: "",
            images: [],
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsLoading(true); // Set loading state to true
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("description", values.description);
            formData.append("price", values.price.toString());
            formData.append("stock", values.stock.toString());
            formData.append("category", categoryMap[selectedCategory]);
            values.images.forEach((file) => formData.append("images", file));

            const response = await fetch("/backend/rental-items", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${session.data?.user.id_token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "등록 실패");
            }

            toast.success("등록이 완료되었습니다!");
            setFiles([]); // Reset file state
            router.push("/main");
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "서버 요청에 실패했습니다."
            );
        } finally {
            setIsLoading(false); // Reset loading state
        }
    }

    return (
        <div className="max-w-3xl mx-auto py-10">
            <div className="bg-white rounded-lg shadow-lg p-6 space-y-8">
                <h2 className="text-2xl font-bold text-center mb-4">
                    캠핑 용품 등록
                </h2>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        {/* 물품 이름 */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="p-4 bg-gray-50 rounded-lg shadow-sm">
                                    <FormLabel>물품 이름</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="예: 캠핑 의자"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* 상세 설명 */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="p-4 bg-gray-50 rounded-lg shadow-sm">
                                    <FormLabel>상세 설명</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="물품에 대한 상세 설명을 입력하세요."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* 가격 */}
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem className="p-4 bg-gray-50 rounded-lg shadow-sm">
                                    <FormLabel>가격</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="예: 5000"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* 수량 */}
                        <FormField
                            control={form.control}
                            name="stock"
                            render={({ field }) => (
                                <FormItem className="p-4 bg-gray-50 rounded-lg shadow-sm">
                                    <FormLabel>수량</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="예: 10"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* 카테고리 */}
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem className="p-4 bg-gray-50 rounded-lg shadow-sm">
                                    <FormLabel>카테고리</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={(value) => {
                                                setSelectedCategory(value);
                                                form.setValue(
                                                    "category",
                                                    categoryMap[value]
                                                );
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="카테고리를 선택하세요" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.keys(categoryMap).map(
                                                    (label) => (
                                                        <SelectItem
                                                            key={label}
                                                            value={label}
                                                        >
                                                            {label}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* 사진 업로드 */}
                        <FormField
                            control={form.control}
                            name="images"
                            render={({ field }) => (
                                <FormItem className="p-4 bg-gray-50 rounded-lg shadow-sm">
                                    <FormLabel>사진 업로드</FormLabel>
                                    <FormControl>
                                        <FileUploader
                                            value={files}
                                            onValueChange={(files) => {
                                                if (files) {
                                                    setFiles(files);
                                                    form.setValue(
                                                        "images",
                                                        files
                                                    );
                                                }
                                            }}
                                            dropzoneOptions={dropZoneConfig}
                                            className="relative bg-background rounded-lg p-2"
                                        >
                                            <FileInput className="outline-dashed outline-1 outline-slate-500">
                                                <div className="flex items-center justify-center flex-col p-8 w-full">
                                                    <span>
                                                        클릭하여 업로드 또는
                                                        파일을 드래그하세요
                                                    </span>
                                                    <p className="text-xs text-gray-500">
                                                        PNG, JPG, JPEG 지원
                                                    </p>
                                                </div>
                                            </FileInput>
                                            <FileUploaderContent>
                                                {files.length > 0 &&
                                                    files.map((file, i) => (
                                                        <FileUploaderItem
                                                            key={i}
                                                            index={i}
                                                        >
                                                            <span>
                                                                {file.name}
                                                            </span>
                                                        </FileUploaderItem>
                                                    ))}
                                            </FileUploaderContent>
                                        </FileUploader>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="text-center">
                            <Button
                                type="submit"
                                className="px-6 py-3 rounded-md bg-blue-500 text-white"
                                disabled={isLoading} // Disable button when loading
                            >
                                {isLoading ? "등록 중..." : "등록하기"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
