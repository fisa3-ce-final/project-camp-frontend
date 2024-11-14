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

interface Comment {
    id: number;
    content: string;
    userId: number;
    createdAt: string;
    updatedAt: string;
}

export default function CommunityPostDetailPage() {
    const [post, setPost] = useState<PostDetail | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isLiked, setIsLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [totalComments, setTotalComments] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const router = useRouter();
    const { id: postId } = useParams();
    const userId = 1;
    const COMMENTS_PER_PAGE = 10;

    useEffect(() => {
        if (postId && !showModal) {
            fetch(`/backend/community/${postId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            })
                .then((res) => {
                    if (res.status === 404) {
                        setShowModal(true);
                        return null;
                    }
                    return res.json();
                })
                .then((data) => {
                    if (data) {
                        setPost(data);
                        setIsLiked(
                            data.isLikedByUser ||
                                localStorage.getItem(`post-${postId}-liked`) ===
                                    "true"
                        );
                    }
                })
                .catch((error) => console.error("게시글 조회 실패:", error));
        }

        loadComments(currentPage);
    }, [postId, showModal, currentPage]);

    const loadComments = (page: number) => {
        fetch(
            `/backend/community/${postId}/comments?page=${page}&size=${COMMENTS_PER_PAGE}`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            }
        )
            .then((res) => res.json())
            .then((data) => {
                setComments(Array.isArray(data.content) ? data.content : []);
                setTotalComments(data.totalElements || 0);
                setTotalPages(data.totalPages || 1);
            })
            .catch((error) => console.error("댓글 조회 실패:", error));
    };

    const handleLikeClick = async () => {
        if (isLoading || !post) return;
        setIsLoading(true);

        try {
            const response = await fetch(
                `/backend/community/${post.id}/like?userId=${userId}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (response.ok) {
                const updatedIsLiked = await response.json();
                const updatedLikes = updatedIsLiked
                    ? post.likes + 1
                    : post.likes - 1;
                setIsLiked(updatedIsLiked);
                setPost({ ...post, likes: updatedLikes });
                localStorage.setItem(
                    `post-${postId}-liked`,
                    updatedIsLiked ? "true" : "false"
                );
            } else {
                console.error("좋아요 요청 실패:", response.statusText);
            }
        } catch (error) {
            console.error("좋아요 요청 에러:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCommentSubmit = async () => {
        if (!newComment) return;

        try {
            const response = await fetch(
                `/backend/community/${postId}/comments`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ content: newComment, userId }),
                    cache: "no-cache",
                }
            );

            if (response.ok) {
                setNewComment("");
                loadComments(1);
                setCurrentPage(1);
            } else {
                console.error("댓글 작성 실패:", response.statusText);
            }
        } catch (error) {
            console.error("댓글 작성 에러:", error);
        }
    };

    const handleCommentDelete = async (commentId: number) => {
        try {
            const response = await fetch(
                `/backend/community/${postId}/comments/${commentId}`,
                {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    cache: "no-cache",
                }
            );

            if (response.ok) {
                loadComments(currentPage);
            } else {
                console.error("댓글 삭제 실패:", response.statusText);
            }
        } catch (error) {
            console.error("댓글 삭제 에러:", error);
        }
    };

    // 게시글 수정 페이지로 이동
    const handleEditClick = () => {
        router.push(`/community/${postId}/edit`);
    };

    // 게시글 삭제
    const handleDeleteClick = async () => {
        try {
            const response = await fetch(
                `/backend/community/${postId}?userId=${userId}`,
                {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    cache: "no-cache",
                }
            );

            if (response.ok) {
                alert("게시글이 삭제되었습니다.");
                router.push("/community/free");
            } else {
                console.error("게시글 삭제 실패:", response.statusText);
            }
        } catch (error) {
            console.error("게시글 삭제 에러:", error);
        }
    };

    // 페이지네이션 핸들러
    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    if (!post && !showModal) return <p>게시글을 불러오는 중입니다...</p>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <p className="text-lg font-semibold mb-4">
                            존재하지 않는 게시글입니다.
                        </p>
                        <button
                            onClick={() => {
                                setShowModal(false);
                                router.push("/community/free");
                            }}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md"
                        >
                            확인
                        </button>
                    </div>
                </div>
            )}
            {!showModal && post && (
                <>
                    <button
                        onClick={() => router.push("/community/free")}
                        className="text-gray-500 text-sm mb-4"
                    >
                        ← 돌아가기
                    </button>
                    <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
                    <div className="text-gray-600 mb-4">
                        <span>작성자 ID: {post.userId}</span> |{" "}
                        <span>
                            {new Date(post.createdAt).toLocaleDateString()}
                        </span>
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
                        <span
                            onClick={handleLikeClick}
                            className="cursor-pointer"
                        >
                            {isLiked ? "❤️" : "🤍"} {post.likes}
                        </span>
                        <span>👁️ {post.viewCount}</span>
                    </div>

                    {/* 게시글 수정 및 삭제 버튼 */}
                    {post.userId === userId && (
                        <div className="flex space-x-4">
                            <button
                                onClick={handleEditClick}
                                className="px-4 py-2 bg-blue-500 text-white rounded"
                            >
                                수정
                            </button>
                            <button
                                onClick={handleDeleteClick}
                                className="px-4 py-2 bg-red-500 text-white rounded"
                            >
                                삭제
                            </button>
                        </div>
                    )}

                    <div className="mt-8">
                        <h2 className="text-2xl font-bold mb-4">
                            댓글 {totalComments}개
                        </h2>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="댓글을 작성해주세요"
                            className="w-full p-2 border rounded mb-2"
                        />
                        <button
                            onClick={handleCommentSubmit}
                            className="px-4 py-2 bg-black text-white rounded"
                        >
                            댓글 작성
                        </button>

                        <div className="mt-4 space-y-4">
                            {comments.length > 0 ? (
                                comments.map((comment) => (
                                    <div
                                        key={comment.id}
                                        className="flex justify-between items-start"
                                    >
                                        <div>
                                            <span className="font-semibold">{`User ${comment.userId}`}</span>
                                            <span className="text-sm text-gray-500 ml-2">
                                                {new Date(
                                                    comment.createdAt
                                                ).toLocaleString()}
                                            </span>
                                            <p className="text-gray-700">
                                                {comment.content}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() =>
                                                handleCommentDelete(comment.id)
                                            }
                                            className="text-gray-500 hover:text-red-600"
                                        >
                                            ✖️
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">
                                    댓글이 없습니다.
                                </p>
                            )}
                        </div>

                        <div className="flex justify-center mt-4 space-x-4">
                            <button
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-gray-200 rounded"
                            >
                                이전
                            </button>
                            <span>
                                페이지 {currentPage} / {totalPages}
                            </span>
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-gray-200 rounded"
                            >
                                다음
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
