// /community/[id]/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, useParams } from "next/navigation";

// interface PostDetail {
//     id: number;
//     title: string;
//     content: string;
//     category: string;
//     userId: number;
//     createdAt: string;
//     updatedAt: string;
//     viewCount: number;
//     likes: number;
//     rating?: number; // 후기 글에만 표시되는 필드 (Optional)
//     imagePaths?: string[]; // 이미지 경로 배열 추가
//     isLikedByUser?: boolean; // 현재 사용자가 좋아요를 누른 상태인지
// }

// export default function CommunityPostDetailPage() {
//     const [post, setPost] = useState<PostDetail | null>(null);
//     const [isLiked, setIsLiked] = useState(false);
//     const [isLoading, setIsLoading] = useState(false); // 좋아요 API 요청 중인지 확인
//     const router = useRouter();
//     const { id: postId } = useParams();
//     const userId = 1; // 예시 사용자 ID (실제 환경에서는 로그인 정보로부터 가져와야 함)

//     // 게시글 상세 정보 조회 API 호출
//     useEffect(() => {
//         if (postId) {
//             fetch(`/backend/community/${postId}`, {
//                 method: "GET",
//                 headers: { "Content-Type": "application/json" },
//             })
//                 .then((res) => res.json())
//                 .then((data) => {
//                     setPost(data);
//                     setIsLiked(data.isLikedByUser || false); // 이미 좋아요가 눌린 상태인지 체크
//                 })
//                 .catch((error) => console.error("게시글 조회 실패:", error));
//         }
//     }, [postId]);

//     // 좋아요 버튼 클릭 핸들러
//     const handleLikeClick = async () => {
//         if (isLoading || !post) return;
//         setIsLoading(true);

//         try {
//             const response = await fetch(`/backend/community/${post.id}/like?userId=${userId}`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//             });

//             if (response.ok) {
//                 const updatedIsLiked = await response.json();
//                 const updatedLikes = updatedIsLiked ? post.likes + 1 : post.likes - 1;
//                 setIsLiked(updatedIsLiked);
//                 setPost({ ...post, likes: updatedLikes });
//             } else {
//                 console.error("좋아요 요청 실패:", response.statusText);
//             }
//         } catch (error) {
//             console.error("좋아요 요청 에러:", error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // 수정 페이지로 이동
//     const handleEditClick = () => {
//         router.push(`/community/${postId}/edit`);
//     };

//     if (!post) return <p>게시글을 불러오는 중입니다...</p>;

//     return (
//         <div className="max-w-4xl mx-auto p-6">
//             <button onClick={() => router.back()} className="text-gray-500 text-sm mb-4">
//                 ← 돌아가기
//             </button>
//             <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
//             <div className="text-gray-600 mb-4">
//                 <span>작성자 ID: {post.userId}</span> | <span>{new Date(post.createdAt).toLocaleDateString()}</span>
//             </div>
//             <p className="text-lg mb-6">{post.content}</p>

//             {post.imagePaths && post.imagePaths.length > 0 && (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
//                     {post.imagePaths.map((imagePath, index) => (
//                         <img
//                             key={index}
//                             src={`http://localhost:8080${imagePath}`}
//                             alt={`이미지 ${index + 1}`}
//                             className="w-full h-auto rounded-lg"
//                         />
//                     ))}
//                 </div>
//             )}

//             <div className="flex space-x-4 items-center text-gray-500 mb-6">
//                 <span onClick={handleLikeClick} className="cursor-pointer">
//                     {isLiked ? "❤️" : "🤍"} {post.likes}
//                 </span>
//                 <span>👁️ {post.viewCount}</span>
//             </div>

//             {post.rating && (
//                 <div className="bg-gray-100 p-2 rounded-md mb-6">
//                     <span className="font-semibold">평점:</span> {post.rating.toFixed(1)}
//                 </div>
//             )}

//             {post.userId === userId && (
//                 <button onClick={handleEditClick} className="mt-4 p-2 bg-blue-500 text-white rounded">
//                     수정
//                 </button>
//             )}
//         </div>
//     );
// }



// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, useParams } from "next/navigation";

// interface PostDetail {
//     id: number;
//     title: string;
//     content: string;
//     category: string;
//     userId: number;
//     createdAt: string;
//     updatedAt: string;
//     viewCount: number;
//     likes: number;
//     rating?: number;
//     imagePaths?: string[];
//     isLikedByUser?: boolean;
// }

// export default function CommunityPostDetailPage() {
//     const [post, setPost] = useState<PostDetail | null>(null);
//     const [isLiked, setIsLiked] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const router = useRouter();
//     const { id: postId } = useParams();
//     const userId = 1; // 예시 사용자 ID (실제 환경에서는 로그인 정보로부터 가져와야 함)

//     // 게시글 상세 정보 조회 API 호출
//     useEffect(() => {
//         if (postId) {
//             fetch(`/backend/community/${postId}`, {
//                 method: "GET",
//                 headers: { "Content-Type": "application/json" },
//             })
//                 .then((res) => res.json())
//                 .then((data) => {
//                     setPost(data);
//                     setIsLiked(data.isLikedByUser || false);
//                 })
//                 .catch((error) => console.error("게시글 조회 실패:", error));
//         }
//     }, [postId]);

//     // 좋아요 버튼 클릭 핸들러
//     const handleLikeClick = async () => {
//         if (isLoading || !post) return;
//         setIsLoading(true);

//         try {
//             const response = await fetch(`/backend/community/${post.id}/like?userId=${userId}`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//             });

//             if (response.ok) {
//                 const updatedIsLiked = await response.json();
//                 const updatedLikes = updatedIsLiked ? post.likes + 1 : post.likes - 1;
//                 setIsLiked(updatedIsLiked);
//                 setPost({ ...post, likes: updatedLikes });
//             } else {
//                 console.error("좋아요 요청 실패:", response.statusText);
//             }
//         } catch (error) {
//             console.error("좋아요 요청 에러:", error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // 수정 페이지로 이동
//     const handleEditClick = () => {
//         router.push(`/community/${postId}/edit`);
//     };

//     // 삭제 요청을 보내는 함수
//     const handleDeleteClick = async () => {
//         try {
//             const response = await fetch(`/backend/community/${postId}?userId=${userId}`, {
//                 method: "DELETE",
//                 headers: { "Content-Type": "application/json" },
//             });

//             if (response.ok) {
//                 alert("게시글이 삭제되었습니다.");
//                 router.push("/community/free"); // 커뮤니티 목록으로 이동
//             } else {
//                 console.error("삭제 실패:", response.statusText);
//             }
//         } catch (error) {
//             console.error("삭제 요청 에러:", error);
//         }
//     };

//     if (!post) return <p>게시글을 불러오는 중입니다...</p>;

//     return (
//         <div className="max-w-4xl mx-auto p-6">
//             <button onClick={() => router.back()} className="text-gray-500 text-sm mb-4">
//                 ← 돌아가기
//             </button>
//             <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
//             <div className="text-gray-600 mb-4">
//                 <span>작성자 ID: {post.userId}</span> | <span>{new Date(post.createdAt).toLocaleDateString()}</span>
//             </div>
//             <p className="text-lg mb-6">{post.content}</p>

//             {post.imagePaths && post.imagePaths.length > 0 && (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
//                     {post.imagePaths.map((imagePath, index) => (
//                         <img
//                             key={index}
//                             src={`http://localhost:8080${imagePath}`}
//                             alt={`이미지 ${index + 1}`}
//                             className="w-full h-auto rounded-lg"
//                         />
//                     ))}
//                 </div>
//             )}

//             <div className="flex space-x-4 items-center text-gray-500 mb-6">
//                 <span onClick={handleLikeClick} className="cursor-pointer">
//                     {isLiked ? "❤️" : "🤍"} {post.likes}
//                 </span>
//                 <span>👁️ {post.viewCount}</span>
//             </div>

//             {post.rating && (
//                 <div className="bg-gray-100 p-2 rounded-md mb-6">
//                     <span className="font-semibold">평점:</span> {post.rating.toFixed(1)}
//                 </div>
//             )}

//             {post.userId === userId && (
//                 <div className="flex space-x-4">
//                     <button onClick={handleEditClick} className="mt-4 p-2 bg-blue-500 text-white rounded">
//                         수정
//                     </button>
//                     <button onClick={handleDeleteClick} className="mt-4 p-2 bg-red-500 text-white rounded">
//                         삭제
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// }




// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, useParams } from "next/navigation";

// interface PostDetail {
//     id: number;
//     title: string;
//     content: string;
//     category: string;
//     userId: number;
//     createdAt: string;
//     updatedAt: string;
//     viewCount: number;
//     likes: number;
//     rating?: number;
//     imagePaths?: string[];
//     isLikedByUser?: boolean;
//     isDeleted: boolean;
// }

// export default function CommunityPostDetailPage() {
//     const [post, setPost] = useState<PostDetail | null>(null);
//     const [isLiked, setIsLiked] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const router = useRouter();
//     const { id: postId } = useParams();
//     const userId = 1; // 예시 사용자 ID (실제 환경에서는 로그인 정보로부터 가져와야 함)

//     // 게시글 상세 정보 조회 API 호출
//     useEffect(() => {
//         if (postId) {
//             fetch(`/backend/community/${postId}`, {
//                 method: "GET",
//                 headers: { "Content-Type": "application/json" },
//             })
//                 .then((res) => res.json())
//                 .then((data) => {
//                     if (data.isDeleted) {  // 삭제된 게시글이면 목록 페이지로 리다이렉트
//                         router.push("/community/free");
//                     } else {
//                         setPost(data);
//                         setIsLiked(data.isLikedByUser || false);
//                     }
//                 })
//                 .catch((error) => console.error("게시글 조회 실패:", error));
//         }
//     }, [postId, router]);

//     // 좋아요 버튼 클릭 핸들러
//     const handleLikeClick = async () => {
//         if (isLoading || !post) return;
//         setIsLoading(true);

//         try {
//             const response = await fetch(`/backend/community/${post.id}/like?userId=${userId}`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//             });

//             if (response.ok) {
//                 const updatedIsLiked = await response.json();
//                 const updatedLikes = updatedIsLiked ? post.likes + 1 : post.likes - 1;
//                 setIsLiked(updatedIsLiked);
//                 setPost({ ...post, likes: updatedLikes });
//             } else {
//                 console.error("좋아요 요청 실패:", response.statusText);
//             }
//         } catch (error) {
//             console.error("좋아요 요청 에러:", error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     // 수정 페이지로 이동
//     const handleEditClick = () => {
//         router.push(`/community/${postId}/edit`);
//     };

//     // 삭제 요청을 보내는 함수
//     const handleDeleteClick = async () => {
//         try {
//             const response = await fetch(`/backend/community/${postId}?userId=${userId}`, {
//                 method: "DELETE",
//                 headers: { "Content-Type": "application/json" },
//             });

//             if (response.ok) {
//                 alert("게시글이 삭제되었습니다.");
//                 router.push("/community/free"); // 커뮤니티 목록으로 이동
//             } else {
//                 console.error("삭제 실패:", response.statusText);
//             }
//         } catch (error) {
//             console.error("삭제 요청 에러:", error);
//         }
//     };

//     if (!post) return <p>게시글을 불러오는 중입니다...</p>;

//     return (
//         <div className="max-w-4xl mx-auto p-6">
//             <button onClick={() => router.back()} className="text-gray-500 text-sm mb-4">
//                 ← 돌아가기
//             </button>
//             <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
//             <div className="text-gray-600 mb-4">
//                 <span>작성자 ID: {post.userId}</span> | <span>{new Date(post.createdAt).toLocaleDateString()}</span>
//             </div>
//             <p className="text-lg mb-6">{post.content}</p>

//             {post.imagePaths && post.imagePaths.length > 0 && (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
//                     {post.imagePaths.map((imagePath, index) => (
//                         <img
//                             key={index}
//                             src={`http://localhost:8080${imagePath}`}
//                             alt={`이미지 ${index + 1}`}
//                             className="w-full h-auto rounded-lg"
//                         />
//                     ))}
//                 </div>
//             )}

//             <div className="flex space-x-4 items-center text-gray-500 mb-6">
//                 <span onClick={handleLikeClick} className="cursor-pointer">
//                     {isLiked ? "❤️" : "🤍"} {post.likes}
//                 </span>
//                 <span>👁️ {post.viewCount}</span>
//             </div>

//             {post.rating && (
//                 <div className="bg-gray-100 p-2 rounded-md mb-6">
//                     <span className="font-semibold">평점:</span> {post.rating.toFixed(1)}
//                 </div>
//             )}

//             {post.userId === userId && (
//                 <div className="flex space-x-4">
//                     <button onClick={handleEditClick} className="mt-4 p-2 bg-blue-500 text-white rounded">
//                         수정
//                     </button>
//                     <button onClick={handleDeleteClick} className="mt-4 p-2 bg-red-500 text-white rounded">
//                         삭제
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// }


"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

interface PostDetail {
    id: number;
    title: string;
    content: string;
    category: string;
    userId: number;
    createdAt: string;
    updatedAt: string;
    viewCount: number;
    likes: number;
    rating?: number;
    imagePaths?: string[];
    isLikedByUser?: boolean;
    isDeleted: boolean;
}

export default function CommunityPostDetailPage() {
    const [post, setPost] = useState<PostDetail | null>(null);
    const [isLiked, setIsLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false); // 모달 표시 상태
    const router = useRouter();
    const { id: postId } = useParams();
    const userId = 1; // 예시 사용자 ID (실제 환경에서는 로그인 정보로부터 가져와야 함)

    // 게시글 상세 정보 조회 API 호출
    useEffect(() => {
        if (postId) {
            fetch(`/backend/community/${postId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })
                .then((res) => {
                    if (res.status === 404) {
                        // 삭제된 게시글이면 모달 표시
                        setShowModal(true);
                        return null;
                    }
                    return res.json();
                })
                .then((data) => {
                    if (data) {
                        setPost(data);
                        setIsLiked(data.isLikedByUser || false);
                    }
                })
                .catch((error) => console.error("게시글 조회 실패:", error));
        }
    }, [postId, router]);

    // 좋아요 버튼 클릭 핸들러
    const handleLikeClick = async () => {
        if (isLoading || !post) return;
        setIsLoading(true);

        try {
            const response = await fetch(`/backend/community/${post.id}/like?userId=${userId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
                const updatedIsLiked = await response.json();
                const updatedLikes = updatedIsLiked ? post.likes + 1 : post.likes - 1;
                setIsLiked(updatedIsLiked);
                setPost({ ...post, likes: updatedLikes });
            } else {
                console.error("좋아요 요청 실패:", response.statusText);
            }
        } catch (error) {
            console.error("좋아요 요청 에러:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // 수정 페이지로 이동
    const handleEditClick = () => {
        router.push(`/community/${postId}/edit`);
    };

    // 삭제 요청을 보내는 함수
    const handleDeleteClick = async () => {
        try {
            const response = await fetch(`/backend/community/${postId}?userId=${userId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
                alert("게시글이 삭제되었습니다.");
                router.push("/community/free"); // 커뮤니티 목록으로 이동
            } else {
                console.error("삭제 실패:", response.statusText);
            }
        } catch (error) {
            console.error("삭제 요청 에러:", error);
        }
    };

    // 모달 확인 버튼 핸들러
    const handleModalClose = () => {
        setShowModal(false);
        router.push("/community/free"); // 게시글 목록으로 이동
    };

    if (!post && !showModal) return <p>게시글을 불러오는 중입니다...</p>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <p className="text-lg font-semibold mb-4">삭제된 게시글입니다.</p>
                        <button
                            onClick={handleModalClose}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md"
                        >
                            확인
                        </button>
                    </div>
                </div>
            )}
            {!showModal && post && (
                <>
                    <button onClick={() => router.back()} className="text-gray-500 text-sm mb-4">
                        ← 돌아가기
                    </button>
                    <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
                    <div className="text-gray-600 mb-4">
                        <span>작성자 ID: {post.userId}</span> | <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-lg mb-6">{post.content}</p>

                    {post.imagePaths && post.imagePaths.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                            {post.imagePaths.map((imagePath, index) => (
                                <img
                                    key={index}
                                    src={`http://localhost:8080${imagePath}`}
                                    alt={`이미지 ${index + 1}`}
                                    className="w-full h-auto rounded-lg"
                                />
                            ))}
                        </div>
                    )}

                    <div className="flex space-x-4 items-center text-gray-500 mb-6">
                        <span onClick={handleLikeClick} className="cursor-pointer">
                            {isLiked ? "❤️" : "🤍"} {post.likes}
                        </span>
                        <span>👁️ {post.viewCount}</span>
                    </div>

                    {post.rating && (
                        <div className="bg-gray-100 p-2 rounded-md mb-6">
                            <span className="font-semibold">평점:</span> {post.rating.toFixed(1)}
                        </div>
                    )}

                    {post.userId === userId && (
                        <div className="flex space-x-4">
                            <button onClick={handleEditClick} className="mt-4 p-2 bg-blue-500 text-white rounded">
                                수정
                            </button>
                            <button onClick={handleDeleteClick} className="mt-4 p-2 bg-red-500 text-white rounded">
                                삭제
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

